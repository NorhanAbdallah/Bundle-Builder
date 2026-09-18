import { useEffect, useId, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  REVIEW_CATEGORY_ORDER,
  calculateTotals,
  estimateMonthlyPayment,
  formatMoney
} from "../../../entities/bundle/pricing";
import type { BundleStep, ProductOption } from "../../../entities/bundle/types";
import badgeImgUrl from "../../../assets/satisfaction-badge.svg";
import { useBundleData } from "../hooks/useBundleData";
import { useBundleStore } from "../store/useBundleStore";
import styles from "./BundleBuilderPage.module.css";

const COLOR_SWATCH: Record<string, string> = {
  White: "#f4f6f8",
  Grey: "#9aa3ad",
  Black: "#1a1d21"
};

function stepCategories(step: BundleStep) {
  return step.categories ?? [step.category];
}

function ProductCard({
  option,
  quantity,
  selectedColor,
  onPlus,
  onMinus,
  onColorChange
}: {
  option: ProductOption;
  quantity: number;
  selectedColor?: string;
  onPlus: () => void;
  onMinus: () => void;
  onColorChange?: (color: string) => void;
}) {
  const canDecrease = quantity > (option.required ? Math.max(1, option.minQuantity) : option.minQuantity);
  const canIncrease = quantity < option.maxQuantity;
  const isSelected = quantity > 0;

  return (
    <article
      className={`${styles.itemCard} ${isSelected ? styles.itemCardSelected : ""}`}
      aria-labelledby={`item-${option.id}-title`}
      data-selected={isSelected}
    >
      {option.badge ? <span className={styles.badge}>{option.badge}</span> : null}
      <div className={styles.itemMedia}>
        <img
          src={option.imageUrl}
          alt=""
          className={styles.itemImage}
          width={72}
          height={72}
          loading="lazy"
        />
        {isSelected ? <span className={styles.selectedChip}>In your system</span> : null}
      </div>
      <h3 id={`item-${option.id}-title`}>{option.name}</h3>
      {option.description ? <p>{option.description}</p> : null}

      {option.colorOptions && option.colorOptions.length > 0 ? (
        <div className={styles.colorRow} role="group" aria-label={`${option.name} color`}>
          {option.colorOptions.map((color) => {
            const active = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                className={`${styles.colorSwatch} ${active ? styles.colorSwatchActive : ""}`}
                style={{ background: COLOR_SWATCH[color] ?? "#ced6de" }}
                aria-label={color}
                aria-pressed={active}
                title={color}
                onClick={() => onColorChange?.(color)}
              />
            );
          })}
        </div>
      ) : null}

      <div className={styles.itemCardFooter}>
        <div className={styles.quantityControl} role="group" aria-label={`${option.name} quantity`}>
          <button
            type="button"
            onClick={onMinus}
            aria-label={`Decrease ${option.name}`}
            disabled={!canDecrease}
            className={`${styles.quantityButton} ${styles.decrementButton}`}
          >
            -
          </button>
          <span aria-live="polite" aria-atomic="true">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onPlus}
            aria-label={`Increase ${option.name}`}
            disabled={!canIncrease}
            className={`${styles.quantityButton} ${styles.incrementButton}`}
          >
            +
          </button>
        </div>
        <div className={styles.itemPrice}>
          {option.compareAtPrice ? (
            <span aria-label={`Was ${formatMoney(option.compareAtPrice)}`}>
              {formatMoney(option.compareAtPrice)}
            </span>
          ) : null}
          <strong aria-label={`Now ${formatMoney(option.price)}`}>{formatMoney(option.price)}</strong>
        </div>
      </div>
    </article>
  );
}

function PlanCard({
  option,
  selected,
  onSelect
}: {
  option: ProductOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.planCard} ${selected ? styles.planCardSelected : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      {option.badge ? <span className={styles.badge}>{option.badge}</span> : null}
      <div className={styles.planCardTop}>
        <span className={styles.planRadio} aria-hidden="true" />
        <div>
          <h3>{option.name}</h3>
          {option.description ? <p>{option.description}</p> : null}
        </div>
      </div>
      <div className={styles.planPrice}>
        {option.compareAtPrice ? <span>{formatMoney(option.compareAtPrice)}</span> : null}
        <strong>
          {option.price === 0 ? "Free" : `${formatMoney(option.price)}/mo`}
        </strong>
      </div>
    </button>
  );
}

function SkeletonPage() {
  return (
    <main className={styles.page} aria-busy="true">
      <div className={styles.shell}>
        <header className={styles.appHeader}>
          <div className={styles.brandBlock}>
            <p className={styles.brand}>Bundle Builder</p>
            <h1>Design your home security system</h1>
          </div>
        </header>
        <div className={styles.layout} role="status" aria-label="Loading bundle options">
          <div className={styles.builderPanel}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={`${styles.stepSection} ${styles.skeletonBlock}`}>
                <div className={styles.skeletonLine} style={{ width: "30%" }} />
                <div className={styles.skeletonLine} style={{ width: "55%" }} />
                <div className={styles.skeletonGrid}>
                  <div className={styles.skeletonCard} />
                  <div className={styles.skeletonCard} />
                </div>
              </div>
            ))}
          </div>
          <aside className={`${styles.reviewPanel} ${styles.skeletonBlock}`}>
            <div className={styles.skeletonLine} style={{ width: "60%" }} />
            <div className={styles.skeletonLine} style={{ width: "40%" }} />
            <div className={styles.skeletonCard} style={{ height: 180 }} />
          </aside>
        </div>
      </div>
    </main>
  );
}

export function BundleBuilderPage() {
  const { items, config, loading, error } = useBundleData();
  const { quantities, colors, initialize, increment, decrement, selectPlan, setColor } =
    useBundleStore();
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const statusId = useId();

  useEffect(() => {
    if (items.length > 0) {
      initialize(items);
    }
  }, [initialize, items]);

  const totals = useMemo(() => calculateTotals(items, quantities), [items, quantities]);
  const monthly = estimateMonthlyPayment(totals.total);
  const selectedItems = useMemo(
    () => items.filter((item) => (quantities[item.id] ?? 0) > 0),
    [items, quantities]
  );
  const totalSelected = useMemo(
    () => selectedItems.reduce((sum, item) => sum + (quantities[item.id] ?? 0), 0),
    [selectedItems, quantities]
  );
  const canCheckout = totalSelected > 0;
  const progress = config
    ? Math.round(
        (config.steps.filter((step) =>
          items
            .filter((item) => stepCategories(step).includes(item.category))
            .some((item) => (quantities[item.id] ?? 0) > 0)
        ).length /
          config.steps.length) *
          100
      )
    : 0;

  const groupedReview = useMemo(() => {
    return REVIEW_CATEGORY_ORDER.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      rows: selectedItems.filter((item) => item.category === category)
    })).filter((group) => group.rows.length > 0);
  }, [selectedItems]);

  useEffect(() => {
    if (!config) return;
    setExpandedSteps((current) => {
      if (Object.keys(current).length > 0) return current;
      return config.steps.reduce<Record<string, boolean>>((acc, step) => {
        acc[step.id] = Boolean(step.defaultExpanded);
        return acc;
      }, {});
    });
  }, [config]);

  function openStep(stepId: string) {
    setExpandedSteps((current) => {
      const next: Record<string, boolean> = {};
      for (const id of Object.keys(current)) {
        next[id] = id === stepId;
      }
      if (!(stepId in next)) next[stepId] = true;
      return next;
    });
  }

  function toggleStep(stepId: string, currentlyExpanded: boolean) {
    setExpandedSteps((current) => ({
      ...current,
      [stepId]: !currentlyExpanded
    }));
  }

  if (loading) {
    return <SkeletonPage />;
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.statePanel} role="alert">
          <h1>We couldn&apos;t load your bundle</h1>
          <p>{error}</p>
          <button type="button" className={styles.retryButton} onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.appHeader}>
          <div className={styles.brandBlock}>
            <p className={styles.brand}>Bundle Builder</p>
            <h1>Design your home security system</h1>
            <p className={styles.lede}>
              Pick cameras, a monitoring plan, sensors, and extras — then review your system before
              checkout.
            </p>
          </div>
          <div className={styles.progressCard} aria-label="Bundle progress">
            <span>{progress}% complete</span>
            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <small>{totalSelected} items in your system</small>
          </div>
        </header>

        <p className={styles.srOnly} id={statusId} aria-live="polite">
          {totalSelected} items selected. Total {formatMoney(totals.total)}.
        </p>

        <div className={styles.layout}>
          <section className={styles.builderPanel} aria-label="Bundle configuration steps">
            {config?.steps.map((step, index) => {
              const categories = stepCategories(step);
              const stepItems = items.filter((item) => categories.includes(item.category));
              const selectedInStep = stepItems.reduce(
                (sum, option) => sum + (quantities[option.id] ?? 0),
                0
              );
              const isExpanded = expandedSteps[step.id] ?? Boolean(step.defaultExpanded);
              const panelId = `step-panel-${step.id}`;
              const titleId = `step-title-${step.id}`;
              const nextStep = config.steps[index + 1];
              const isPlanStep = categories.includes("plan");

              return (
                <section
                  key={step.id}
                  className={`${styles.stepSection} ${isExpanded ? styles.stepSectionOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.stepHeaderButton}
                    onClick={() => toggleStep(step.id, isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                  >
                    <header className={styles.stepHeader}>
                      <small>
                        Step {index + 1} of {config.steps.length}
                      </small>
                      <h2 id={titleId}>{step.title}</h2>
                    </header>
                    <div className={styles.stepMeta}>
                      <span>{selectedInStep} selected</span>
                      <span className={styles.chevron} aria-hidden="true">
                        {isExpanded ? "▴" : "▾"}
                      </span>
                    </div>
                  </button>

                  <div id={panelId} role="region" aria-labelledby={titleId} hidden={!isExpanded}>
                    {stepItems.length > 0 ? (
                      isPlanStep ? (
                        <div className={styles.planGrid}>
                          {stepItems.map((option) => (
                            <PlanCard
                              key={option.id}
                              option={option}
                              selected={(quantities[option.id] ?? 0) > 0}
                              onSelect={() => selectPlan(option, stepItems)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={styles.itemsGrid}>
                          {stepItems.map((option) => (
                            <ProductCard
                              key={option.id}
                              option={option}
                              quantity={quantities[option.id] ?? 0}
                              selectedColor={colors[option.id]}
                              onPlus={() => increment(option)}
                              onMinus={() => decrement(option)}
                              onColorChange={(color) => setColor(option.id, color)}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <div className={styles.emptyStep}>No options in this step yet.</div>
                    )}

                    {nextStep ? (
                      <div className={styles.stepActions}>
                        <button
                          type="button"
                          className={styles.nextStepButton}
                          onClick={() => openStep(nextStep.id)}
                        >
                          Next: {nextStep.title}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </section>

          <aside className={styles.reviewPanel} aria-label="Order summary">
            <div className={styles.reviewIntro}>
              <h2>Your security system</h2>
              <p aria-live="polite">{totalSelected} items selected</p>
            </div>

            {groupedReview.length > 0 ? (
              <div className={styles.reviewGroups}>
                {groupedReview.map((group) => (
                  <section key={group.category} className={styles.reviewGroup}>
                    <h3>{group.label}</h3>
                    <ul className={styles.reviewList}>
                      {group.rows.map((option) => {
                        const qty = quantities[option.id] ?? 0;
                        const color = colors[option.id];
                        return (
                          <li key={option.id}>
                            <div>
                              <span>{option.name}</span>
                              {color ? <small>{color}</small> : null}
                            </div>
                            <strong>×{qty}</strong>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <p className={styles.emptyReview}>
                Add cameras or sensors to start building your system.
              </p>
            )}

            <div className={styles.checkoutSummaryCard}>
              <div className={styles.guaranteeRow}>
                <img
                  src={badgeImgUrl}
                  alt=""
                  className={styles.guaranteeBadge}
                  width={78}
                  height={78}
                />
                <div className={styles.guaranteeText}>
                  <h3>30-day hassle-free returns</h3>
                  <p>
                    If you&apos;re not totally in love with the product, we will refund you 100%.
                  </p>
                </div>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.financingPill}>
                  {monthly > 0 ? `as low as ${formatMoney(monthly)}/mo` : "Pay in full today"}
                </span>
                <div className={styles.pricePair}>
                  {totals.savings > 0 ? (
                    <span className={styles.originalTotal}>{formatMoney(totals.subtotal)}</span>
                  ) : null}
                  <strong className={styles.finalTotal}>{formatMoney(totals.total)}</strong>
                </div>
              </div>

              <p className={styles.savingsText} aria-live="polite">
                {totals.savings > 0
                  ? `Nice pick! You're saving ${formatMoney(totals.savings)} on this bundle.`
                  : "Add discounted items to unlock bundle savings."}
              </p>

              <button
                type="button"
                className={styles.checkoutButton}
                disabled={!canCheckout}
                aria-describedby={!canCheckout ? "checkout-hint" : undefined}
                onClick={() =>
                  setStatusMessage(
                    `Checkout started — ${totalSelected} items totaling ${formatMoney(totals.total)}.`
                  )
                }
              >
                {config?.checkoutLabel ?? "Checkout"}
              </button>
              {!canCheckout ? (
                <p id="checkout-hint" className={styles.checkoutHint}>
                  Select at least one item to continue.
                </p>
              ) : null}

              <button
                type="button"
                className={styles.saveForLaterLink}
                onClick={() => setStatusMessage("Bundle saved on this device for later.")}
              >
                Save my system for later
              </button>
              {statusMessage ? (
                <p className={styles.feedback} role="status">
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

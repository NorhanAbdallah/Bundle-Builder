import { useEffect, useMemo, useState } from "react";
import { calculateTotals, formatMoney } from "../../../entities/bundle/pricing";
import type { ProductOption } from "../../../entities/bundle/types";
import badgeImgUrl from "../../../assets/satisfaction-badge.svg";
import { useBundleData } from "../hooks/useBundleData";
import { useBundleStore } from "../store/useBundleStore";
import styles from "./BundleBuilderPage.module.css";

function ItemCard({
  option,
  quantity,
  onPlus,
  onMinus
}: {
  option: ProductOption;
  quantity: number;
  onPlus: () => void;
  onMinus: () => void;
}) {
  return (
    <article className={styles.itemCard}>
      {option.badge ? <span className={styles.badge}>{option.badge}</span> : null}
      <img src={option.imageUrl} alt={option.name} className={styles.itemImage} />
      <h3>{option.name}</h3>
      {option.description ? <p>{option.description}</p> : null}
      <div className={styles.itemCardFooter}>
        <div className={styles.quantityControl}>
          <button
            type="button"
            onClick={onMinus}
            aria-label={`decrement ${option.name}`}
            className={`${styles.quantityButton} ${styles.decrementButton}`}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={onPlus}
            aria-label={`increment ${option.name}`}
            className={`${styles.quantityButton} ${styles.incrementButton}`}
          >
            +
          </button>
        </div>
        <div className={styles.itemPrice}>
          {option.compareAtPrice ? <span>{formatMoney(option.compareAtPrice)}</span> : null}
          <strong>{formatMoney(option.price)}</strong>
        </div>
      </div>
    </article>
  );
}

export function BundleBuilderPage() {
  const { items, config, loading, error } = useBundleData();
  const { quantities, initialize, increment, decrement } = useBundleStore();
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (items.length > 0) {
      initialize(items);
    }
  }, [initialize, items]);

  const totals = useMemo(() => calculateTotals(items, quantities), [items, quantities]);
  const totalSelected = useMemo(
    () => Object.values(quantities).reduce((sum, qty) => sum + qty, 0),
    [quantities]
  );

  useEffect(() => {
    if (!config) return;
    setExpandedSteps((current) => {
      // Keep server defaults on first load, then let user toggles drive state.
      if (Object.keys(current).length > 0) return current;
      return config.steps.reduce<Record<string, boolean>>((acc, step) => {
        acc[step.id] = Boolean(step.defaultExpanded);
        return acc;
      }, {});
    });
  }, [config]);

  if (loading) return <main className={styles.page}>Getting your bundle ready...</main>;
  if (error) return <main className={styles.page}>We couldn&apos;t load bundle data: {error}</main>;

  return (
    <main className={styles.page}>
      <section className={styles.builderPanel}>
        {config?.steps.map((step, index) => {
          const stepItems = items.filter((item) => item.category === step.category);
          const selectedInStep = stepItems.reduce((sum, option) => sum + (quantities[option.id] ?? 0), 0);
          const isExpanded = expandedSteps[step.id] ?? Boolean(step.defaultExpanded);
          return (
            <section key={step.id} className={styles.stepSection}>
              <button
                type="button"
                className={styles.stepHeaderButton}
                onClick={() =>
                  setExpandedSteps((current) => ({
                    ...current,
                    [step.id]: !isExpanded
                  }))
                }
                aria-expanded={isExpanded}
              >
                <header className={styles.stepHeader}>
                  <small>
                    Step {index + 1} of {config.steps.length}
                  </small>
                  <h2>{step.title}</h2>
                </header>
                <div className={styles.stepMeta}>
                  <span>{selectedInStep} selected</span>
                  <span className={styles.chevron}>{isExpanded ? "▴" : "▾"}</span>
                </div>
              </button>
              {isExpanded ? (
                <div className={styles.itemsGrid}>
                  {stepItems.map((option) => (
                    <ItemCard
                      key={option.id}
                      option={option}
                      quantity={quantities[option.id] ?? 0}
                      onPlus={() => increment(option)}
                      onMinus={() => decrement(option)}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.collapsedStep}>Open this step to customize it.</div>
              )}
            </section>
          );
        })}
      </section>

      <aside className={styles.reviewPanel}>
        <h2>Your build so far</h2>
        <p>{totalSelected} items selected</p>
        <ul className={styles.reviewList}>
          {items.map((option) => (
            <li key={option.id}>
              <span>{option.name}</span>
              <strong>{quantities[option.id] ?? 0}</strong>
            </li>
          ))}
        </ul>

        <div className={styles.checkoutSummaryCard}>
          <div className={styles.guaranteeRow}>
            <img src={badgeImgUrl} alt="Satisfaction quality badge" className={styles.guaranteeBadge} />
            <div className={styles.guaranteeText}>
              <h3>30-day hassle-free returns</h3>
              <p>If you're not totally in love with the product, we will refund you 100%.</p>
            </div>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.financingPill}>as low as $19.19/mo</span>
            <div className={styles.pricePair}>
              <span className={styles.originalTotal}>{formatMoney(totals.subtotal)}</span>
              <strong className={styles.finalTotal}>{formatMoney(totals.total)}</strong>
            </div>
          </div>

          <p className={styles.savingsText}>
            Nice pick! You&apos;re saving {formatMoney(totals.savings)} on this bundle.
          </p>

          <button type="button" className={styles.checkoutButton}>
            {config?.checkoutLabel ?? "Checkout"}
          </button>

          <button type="button" className={styles.saveForLaterLink}>
            Save my system for later
          </button>
        </div>
      </aside>
    </main>
  );
}

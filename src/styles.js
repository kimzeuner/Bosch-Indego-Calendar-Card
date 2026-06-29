export const CARD_STYLES = `
  .card {
    padding: 16px;
  }

  .title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .subtitle {
    margin-top: 0;
    margin-bottom: 14px;
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  .scale {
    display: grid;
    grid-template-columns: 44px 1fr;
    margin-bottom: 8px;
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  .scale-inner {
    position: relative;
    height: 18px;
  }

  .scale-inner span {
    position: absolute;
    transform: translateX(-50%);
  }

  .row {
    display: grid;
    grid-template-columns: 44px 1fr;
    height: 44px;
    margin-bottom: 10px;
  }

  .day {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px 0 0 18px;
    font-weight: 600;
  }

  .track {
    position: relative;
    height: 44px;
    border: 1px solid var(--divider-color);
    border-left: none;
    border-radius: 0 18px 18px 0;
    overflow: hidden;
    background: var(--card-background-color);
  }

  .line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--divider-color);
    z-index: 1;
  }

  .slot {
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: 16px;
    z-index: 2;
  }

  .weather-exclusion {
    position: absolute;
    top: 6px;
    bottom: 6px;
    border-radius: 12px;
    z-index: 4;
    background-image:
      repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0) 0px,
        rgba(255, 255, 255, 0) 4px,
        rgba(255, 255, 255, 0.4) 4px,
        rgba(255, 255, 255, 0.4) 8px
      );
  }

  .now-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    z-index: 5;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
    color: var(--secondary-text-color);
    font-size: 12px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .legend-box {
    width: 22px;
    height: 10px;
    border-radius: 5px;
    display: inline-block;
  }

  .legend-weather {
    background-image:
      repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0) 0px,
        rgba(255, 255, 255, 0) 4px,
        rgba(255, 255, 255, 0.4) 4px,
        rgba(255, 255, 255, 0.4) 8px
      );
  }

  .legend-now {
    width: 3px;
    height: 14px;
    border-radius: 2px;
    display: inline-block;
  }
`;

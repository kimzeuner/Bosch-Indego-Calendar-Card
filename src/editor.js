import { LitElement, html, css } from "lit";
import { DEFAULT_CONFIG, calendarEntityOptions } from "./helpers.js";
import { getTranslations, t } from "./translations.js";

export class IndegoCalendarCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  static styles = css`
    .editor {
      padding: 16px;
    }

    .field {
      margin-bottom: 16px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    ha-form {
      display: block;
      width: 100%;
    }

    @media (max-width: 600px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }
  `;

  setConfig(config) {
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entity: config.entity ?? DEFAULT_CONFIG.entity,
      title: config.title ?? DEFAULT_CONFIG.title,
    };
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const translations = getTranslations(this.hass);
    const entities = calendarEntityOptions(this.hass);

    if (!this._config.entity && entities.length > 0) {
      this._config = {
        ...this._config,
        entity: entities[0].value,
      };
    }

    return html`
      <div class="editor">
        <div class="field">
          ${this.renderForm(
            [
              {
                name: "entity",
                label: t(translations, "entity"),
                required: true,
                selector: {
                  select: {
                    mode: "dropdown",
                    options: entities,
                  },
                },
              },
              {
                name: "title",
                label: t(translations, "title_field"),
                selector: {
                  text: {},
                },
              },
            ],
            this._config
          )}
        </div>

        <div class="field grid-2">
          ${this.renderTextForm(
            "day_color",
            this._config.day_color,
            t(translations, "day_color")
          )}
          ${this.renderTextForm(
            "day_text_color",
            this._config.day_text_color,
            t(translations, "day_text_color")
          )}
        </div>

        <div class="field grid-2">
          ${this.renderTextForm(
            "slot_color",
            this._config.slot_color,
            t(translations, "slot_color")
          )}
          ${this.renderTextForm(
            "now_color",
            this._config.now_color,
            t(translations, "now_color")
          )}
        </div>

        <div class="field">
          ${this.renderForm(
            [
              {
                name: "highlight_today",
                label: t(translations, "highlight_today"),
                selector: {
                  boolean: {},
                },
              },
              {
                name: "today_border_color",
                label: t(translations, "today_border_color"),
                selector: {
                  text: {},
                },
              },
              {
                name: "show_weather_exclusions",
                label: t(translations, "show_weather_exclusions"),
                selector: {
                  boolean: {},
                },
              },
              {
                name: "weather_exclusion_color",
                label: t(translations, "weather_exclusion_color"),
                selector: {
                  text: {},
                },
              },
              {
                name: "show_next_mow",
                label: t(translations, "show_next_mow"),
                selector: {
                  boolean: {},
                },
              },
              {
                name: "show_legend",
                label: t(translations, "show_legend"),
                selector: {
                  boolean: {},
                },
              },
            ],
            this._config
          )}
        </div>
      </div>
    `;
  }

  renderTextForm(key, value, label) {
    return html`
      ${this.renderForm(
        [
          {
            name: key,
            label,
            selector: {
              text: {},
            },
          },
        ],
        { [key]: value }
      )}
    `;
  }

  renderForm(schema, data) {
    return html`
      <ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${data}
        .computeLabel=${(item) => item.label || item.name}
        @value-changed=${(event) => this.handleValueChanged(event)}
      ></ha-form>
    `;
  }

  handleValueChanged(event) {
    this.updateConfig(event.detail.value);
  }

  updateConfig(changes) {
    this._config = {
      ...this._config,
      ...changes,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

if (!customElements.get("indego-calendar-card-editor")) {
  customElements.define("indego-calendar-card-editor", IndegoCalendarCardEditor);
}

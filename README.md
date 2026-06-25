# Bosch Indego Calendar Card

A custom Home Assistant Lovelace card for visualizing Bosch Indego mowing schedules as a weekly calendar.

The card supports both the classic Indego calendar entities and the SmartMowing predictive schedule entities.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-blue)
![Bosch Indego](https://img.shields.io/badge/Bosch-Indego-green)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)

---

## Features

- Weekly mowing schedule visualization
- Supports Indego `*_calendar_slots` entity
- Support Indego `*_predictive_schedule`entity
- Supports SmartMowing predictive schedule entities
- Multiple mowing windows per day
- Current time indicator
- Optional highlight of today's row
- Weather exclusion visualization with striped overlay
- Tooltips for mowing windows and weather exclusions
- Next mowing slot subtitle
- Automatic next mowing slot detection
- Built-in legend
- Built-in Lovelace visual editor
- English and German localization
- Theme-aware colors
- Supports:
  - CSS color names
  - HEX colors
  - RGB/RGBA
  - Theme variables (`var(--primary-color)`)
  - Theme variable shorthand (`primary-color`)

---

## Supported Entities

### Calendar Slots

```yaml
monday_slot_1: 08:00-12:00
monday_slot_2: 14:00-16:00
```

### SmartMowing Predictive Schedule

```yaml
schedule_monday: 08:00-11:00, 12:00-20:00
exclusion_monday_weather: 05:00-08:00
next_mow_slot: Monday 08:00-11:00
```

---

## Installation

### HACS (Custom Repository)

1. Open HACS
2. Select **Custom Repositories**
3. Add:

```
https://github.com/kimzeuner/Bosch-Indego-Calendar-Card
```

4. Category:

```
Dashboard
```

5. Install
6. Refresh your browser

---

### Manual Installation

Copy:

```
indego-calendar-card.js
```

to:

```
/config/www/indego-calendar-card.js
```

Add a dashboard resource:

```yaml
url: /local/indego-calendar-card.js
type: module
```

---

## Basic Configuration

```yaml
type: custom:indego-calendar-card
entity: sensor.indego_calendar_slots
```

---

## Full Example

```yaml
type: custom:indego-calendar-card
entity: sensor.indego_predictive_schedule
title: SmartMowing Calendar
highlight_today: true
show_weather_exclusions: true
show_next_mow: true
show_legend: true
day_color: var(--primary-color)
day_text_color: white
slot_color: "#007a3d"
weather_exclusion_color: rgba(80,160,255,0.35)
now_color: orange
today_border_color: gold
```

---

## Configuration Options

| Option | Default | Description |
|----------|----------|----------|
| entity | required | Calendar entity |
| title | Calendar | Card title |
| day_color | #007a3d | Day label background |
| day_text_color | #ffffff | Day label text color |
| slot_color | #007a3d | Mowing window color |
| weather_exclusion_color | rgba(80,160,255,0.35) | Weather exclusion color |
| now_color | #a6ce39 | Current time indicator color |
| today_border_color | #ffd700 | Highlight color for current day |
| highlight_today | false | Highlight current day |
| show_weather_exclusions | true | Show weather exclusions |
| show_next_mow | true | Show next mowing slot subtitle |
| show_legend | true | Show legend |

---

## Color Formats

The card supports all common CSS color formats:

```yaml
day_color: blue
day_color: "#007a3d"
day_color: rgb(0,122,61)
day_color: rgba(0,122,61,0.5)
day_color: var(--primary-color)
day_color: primary-color
day_color: --primary-color
```

---

## Screenshot

Example SmartMowing Schedule:

![Bosch Indego Calendar Card](images/example_predictive_full.png)

- Weekly mowing schedule
- Current time indicator
- Weather exclusions
- Next mowing slot information
- Legend

---

## Compatibility

Tested with:

- Home Assistant 2026.6.x
- Bosch Indego Integration

---

## Support this project ❤️

If this project saves you time or is useful to you, you can support its development:

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?logo=paypal&logoColor=white)](https://www.paypal.me/KZeuner)

Thank you very much! 😊

---

## License

MIT

---

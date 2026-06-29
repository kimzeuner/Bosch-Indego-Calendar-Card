var Et = Object.defineProperty;
var St = (o, t, e) => t in o ? Et(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var P = (o, t, e) => St(o, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, J = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), tt = /* @__PURE__ */ new WeakMap();
let pt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (J && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = tt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && tt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ft = (o) => new pt(typeof o == "string" ? o : o + "", void 0, Y), gt = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((s, n, i) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + o[i + 1], o[0]);
  return new pt(e, o, Y);
}, Ct = (o, t) => {
  if (J) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = z.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, o.appendChild(s);
  }
}, et = J ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ft(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: Pt, getOwnPropertyDescriptor: Mt, getOwnPropertyNames: Nt, getOwnPropertySymbols: Ot, getPrototypeOf: Ut } = Object, m = globalThis, st = m.trustedTypes, Ht = st ? st.emptyScript : "", B = m.reactiveElementPolyfillSupport, N = (o, t) => o, Z = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? Ht : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, $t = (o, t) => !Tt(o, t), nt = { attribute: !0, type: String, converter: Z, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = nt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Pt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: i } = Mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const l = n == null ? void 0 : n.call(this);
      i == null || i.call(this, r), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const e = this.properties, s = [...Nt(e), ...Ot(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(et(n));
    } else t !== void 0 && e.push(et(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ct(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var i;
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const r = (((i = s.converter) == null ? void 0 : i.toAttribute) !== void 0 ? s.converter : Z).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var i, r;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const l = s.getPropertyOptions(n), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((i = l.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? l.converter : Z;
      this._$Em = n;
      const c = a.fromAttribute(e, l.type);
      this[n] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(n)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, i) {
    var r;
    if (t !== void 0) {
      const l = this.constructor;
      if (n === !1 && (i = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? $t)(i, e) || s.useDefault && s.reflect && i === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: i }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), i !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [i, r] of n) {
        const { wrapped: l } = r, a = this[i];
        l !== !0 || this._$AL.has(i) || a === void 0 || this.C(i, void 0, r, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((n) => {
        var i;
        return (i = n.hostUpdate) == null ? void 0 : i.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var n;
      return (n = s.hostUpdated) == null ? void 0 : n.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[N("elementProperties")] = /* @__PURE__ */ new Map(), E[N("finalized")] = /* @__PURE__ */ new Map(), B == null || B({ ReactiveElement: E }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, ot = (o) => o, F = O.trustedTypes, it = F ? F.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, yt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, mt = "?" + y, kt = `<${mt}>`, v = document, U = () => v.createComment(""), H = (o) => o === null || typeof o != "object" && typeof o != "function", G = Array.isArray, Rt = (o) => G(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", I = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, at = />/g, w = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, dt = /"/g, wt = /^(?:script|style|textarea|title)$/i, Dt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), u = Dt(1), C = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), x = v.createTreeWalker(v, 129);
function xt(o, t) {
  if (!G(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const zt = (o, t) => {
  const e = o.length - 1, s = [];
  let n, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = M;
  for (let l = 0; l < e; l++) {
    const a = o[l];
    let c, _, d = -1, g = 0;
    for (; g < a.length && (r.lastIndex = g, _ = r.exec(a), _ !== null); ) g = r.lastIndex, r === M ? _[1] === "!--" ? r = rt : _[1] !== void 0 ? r = at : _[2] !== void 0 ? (wt.test(_[2]) && (n = RegExp("</" + _[2], "g")), r = w) : _[3] !== void 0 && (r = w) : r === w ? _[0] === ">" ? (r = n ?? M, d = -1) : _[1] === void 0 ? d = -2 : (d = r.lastIndex - _[2].length, c = _[1], r = _[3] === void 0 ? w : _[3] === '"' ? dt : lt) : r === dt || r === lt ? r = w : r === rt || r === at ? r = M : (r = w, n = void 0);
    const $ = r === w && o[l + 1].startsWith("/>") ? " " : "";
    i += r === M ? a + kt : d >= 0 ? (s.push(c), a.slice(0, d) + yt + a.slice(d) + y + $) : a + y + (d === -2 ? l : $);
  }
  return [xt(o, i + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class k {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let i = 0, r = 0;
    const l = t.length - 1, a = this.parts, [c, _] = zt(t, e);
    if (this.el = k.createElement(c, s), x.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = x.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(yt)) {
          const g = _[r++], $ = n.getAttribute(d).split(y), D = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: i, name: D[2], strings: $, ctor: D[1] === "." ? Wt : D[1] === "?" ? Ft : D[1] === "@" ? jt : j }), n.removeAttribute(d);
        } else d.startsWith(y) && (a.push({ type: 6, index: i }), n.removeAttribute(d));
        if (wt.test(n.tagName)) {
          const d = n.textContent.split(y), g = d.length - 1;
          if (g > 0) {
            n.textContent = F ? F.emptyScript : "";
            for (let $ = 0; $ < g; $++) n.append(d[$], U()), x.nextNode(), a.push({ type: 2, index: ++i });
            n.append(d[g], U());
          }
        }
      } else if (n.nodeType === 8) if (n.data === mt) a.push({ type: 2, index: i });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(y, d + 1)) !== -1; ) a.push({ type: 7, index: i }), d += y.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function T(o, t, e = o, s) {
  var r, l;
  if (t === C) return t;
  let n = s !== void 0 ? (r = e._$Co) == null ? void 0 : r[s] : e._$Cl;
  const i = H(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== i && ((l = n == null ? void 0 : n._$AO) == null || l.call(n, !1), i === void 0 ? n = void 0 : (n = new i(o), n._$AT(o, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = T(o, n._$AS(o, t.values), n, s)), t;
}
class Lt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? v).importNode(e, !0);
    x.currentNode = n;
    let i = x.nextNode(), r = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new R(i, i.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(i, a.name, a.strings, this, t) : a.type === 6 && (c = new Bt(i, this, t)), this._$AV.push(c), a = s[++l];
      }
      r !== (a == null ? void 0 : a.index) && (i = x.nextNode(), r++);
    }
    return x.currentNode = v, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = T(this, t, e), H(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var i;
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = k.createElement(xt(s.h, s.h[0]), this.options)), s);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === n) this._$AH.p(e);
    else {
      const r = new Lt(n, this), l = r.u(this.options);
      r.p(e), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = ct.get(t.strings);
    return e === void 0 && ct.set(t.strings, e = new k(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const i of t) n === e.length ? e.push(s = new R(this.O(U()), this.O(U()), this, this.options)) : s = e[n], s._$AI(i), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = ot(t).nextSibling;
      ot(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, i) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = i, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, n) {
    const i = this.strings;
    let r = !1;
    if (i === void 0) t = T(this, t, e, 0), r = !H(t) || t !== this._$AH && t !== C, r && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = i[0], a = 0; a < i.length - 1; a++) c = T(this, l[s + a], e, a), c === C && (c = this._$AH[a]), r || (r = !H(c) || c !== this._$AH[a]), c === p ? t = p : t !== p && (t += (c ?? "") + i[a + 1]), this._$AH[a] = c;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Ft extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class jt extends j {
  constructor(t, e, s, n, i) {
    super(t, e, s, n, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? p) === C) return;
    const s = this._$AH, n = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, i = t !== p && (s === p || n);
    n && this.element.removeEventListener(this.name, this, s), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Bt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    T(this, t);
  }
}
const q = O.litHtmlPolyfillSupport;
q == null || q(k, R), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.3");
const It = (o, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const i = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = n = new R(t.insertBefore(U(), i), i, void 0, e ?? {});
  }
  return n._$AI(o), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const b = globalThis;
class S extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = It(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return C;
  }
}
var _t;
S._$litElement$ = !0, S.finalized = !0, (_t = b.litElementHydrateSupport) == null || _t.call(b, { LitElement: S });
const V = b.litElementPolyfillSupport;
V == null || V({ LitElement: S });
(b.litElementVersions ?? (b.litElementVersions = [])).push("4.2.2");
const Q = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
], f = {
  entity: null,
  title: null,
  day_color: "#007a3d",
  highlight_today: !1,
  today_border_color: "#ffd700",
  slot_color: "#007a3d",
  now_color: "#a6ce39",
  day_text_color: "#ffffff",
  weather_exclusion_color: "rgba(80, 160, 255, 0.35)",
  show_weather_exclusions: !0,
  show_next_mow: !0,
  show_legend: !0
};
function A(o, t) {
  if (!o) return t;
  if (Array.isArray(o))
    return o.length >= 4 ? `rgba(${o[0]}, ${o[1]}, ${o[2]}, ${o[3]})` : `rgb(${o[0]}, ${o[1]}, ${o[2]})`;
  if (typeof o != "string") return t;
  const e = o.trim();
  return e ? e.startsWith("--") ? `var(${e})` : e.startsWith("var(") || typeof CSS < "u" && CSS.supports && CSS.supports("color", e) ? e : `var(--${e})` : t;
}
function L(o) {
  return !o || o === "not_enabled" || o === "not_scheduled" || o === "none" ? [] : String(o).split(",").map((t) => t.trim()).filter(
    (t) => t && t !== "not_enabled" && t !== "not_scheduled" && t !== "none"
  );
}
function bt(o = {}) {
  const t = o.monday_slot_1 !== void 0 && o.tuesday_slot_1 !== void 0 && o.wednesday_slot_1 !== void 0 && o.thursday_slot_1 !== void 0 && o.friday_slot_1 !== void 0 && o.saturday_slot_1 !== void 0 && o.sunday_slot_1 !== void 0, e = o.schedule_monday !== void 0 && o.schedule_tuesday !== void 0 && o.schedule_wednesday !== void 0 && o.schedule_thursday !== void 0 && o.schedule_friday !== void 0 && o.schedule_saturday !== void 0 && o.schedule_sunday !== void 0;
  return t || e;
}
function qt(o, t) {
  return (t ? o.states[t] : void 0) ? t : Object.keys(o.states).find(
    (s) => bt(o.states[s].attributes)
  );
}
function Vt(o) {
  return Object.entries(o.states).filter(([, t]) => bt(t.attributes)).map(([t, e]) => ({
    value: t,
    label: e.attributes.friendly_name || t
  }));
}
function vt(o, t) {
  const e = o[`schedule_${t}`];
  return e !== void 0 ? L(e) : [
    ...L(o[`${t}_slot_1`]),
    ...L(o[`${t}_slot_2`])
  ];
}
function Zt(o, t) {
  return L(o[`exclusion_${t}_weather`]);
}
function ht() {
  return Q[((/* @__PURE__ */ new Date()).getDay() + 6) % 7];
}
function ut(o) {
  if (!o || !o.includes("-")) return null;
  const [t, e] = o.split("-").map((c) => c.trim()), [s, n] = t.split(":").map(Number), [i, r] = e.split(":").map(Number), l = s * 60 + n, a = i * 60 + r;
  return Number.isNaN(l) || Number.isNaN(a) || a <= l ? null : {
    left: l / 1440 * 100,
    width: (a - l) / 1440 * 100
  };
}
function Kt(o) {
  const t = /* @__PURE__ */ new Date(), e = (t.getDay() + 6) % 7, s = t.getHours() * 60 + t.getMinutes();
  for (let n = 0; n < 7; n += 1) {
    const i = (e + n) % 7, r = Q[i];
    for (const l of vt(o, r)) {
      if (!l || !l.includes("-")) continue;
      const [a] = l.split("-").map((g) => g.trim()), [c, _] = a.split(":").map(Number), d = c * 60 + _;
      if (!(n === 0 && d <= s))
        return { day: r, slot: l };
    }
  }
}
const Xt = "Kalender", Jt = "Titel", Yt = "Entität", Gt = "Tagesfarbe", Qt = "Mähfensterfarbe", te = "Aktuelle Zeit Farbe", ee = "Rahmenfarbe Heute", se = "Textfarbe Tag", ne = "Wettersperrzeit Farbe", oe = "Heutigen Tag hervorheben", ie = "Entität erforderlich", re = "Entität nicht gefunden", ae = "Mo", le = "Di", de = "Mi", ce = "Do", he = "Fr", ue = "Sa", _e = "So", pe = "Nächster Mähslot", fe = "Nächsten Mähslot anzeigen", ge = "Legende anzeigen", $e = "Mähfenster", ye = "Wettersperrzeit", me = "Aktuelle Zeit", we = "Mähfenster", xe = "Wettersperrzeit", be = "Wettersperrzeiten anzeigen", ve = {
  title: Xt,
  title_field: Jt,
  entity: Yt,
  day_color: Gt,
  slot_color: Qt,
  now_color: te,
  today_border_color: ee,
  day_text_color: se,
  weather_exclusion_color: ne,
  highlight_today: oe,
  entity_required: ie,
  entity_not_found: re,
  monday: ae,
  tuesday: le,
  wednesday: de,
  thursday: ce,
  friday: he,
  saturday: ue,
  sunday: _e,
  subtitle_next_mow: pe,
  show_next_mow: fe,
  show_legend: ge,
  legend_mowing: $e,
  legend_weather: ye,
  legend_now: me,
  tooltip_mowing: we,
  tooltip_weather: xe,
  show_weather_exclusions: be
}, Ae = "Calendar", Ee = "Title", Se = "Entity", Ce = "Day Color", Te = "Slot Color", Pe = "Current Time Color", Me = "Today Border Color", Ne = "Day Text Color", Oe = "Weather Exclusion Color", Ue = "Highlight Today", He = "Entity required", ke = "Entity not found", Re = "Mon", De = "Tue", ze = "Wed", Le = "Thu", We = "Fri", Fe = "Sat", je = "Sun", Be = "Next mow", Ie = "Show Next Mow", qe = "Show Legend", Ve = "Mowing window", Ze = "Weather exclusion", Ke = "Current time", Xe = "Mowing window", Je = "Weather exclusion", Ye = "Show Weather Exclusions", Ge = {
  title: Ae,
  title_field: Ee,
  entity: Se,
  day_color: Ce,
  slot_color: Te,
  now_color: Pe,
  today_border_color: Me,
  day_text_color: Ne,
  weather_exclusion_color: Oe,
  highlight_today: Ue,
  entity_required: He,
  entity_not_found: ke,
  monday: Re,
  tuesday: De,
  wednesday: ze,
  thursday: Le,
  friday: We,
  saturday: Fe,
  sunday: je,
  subtitle_next_mow: Be,
  show_next_mow: Ie,
  show_legend: qe,
  legend_mowing: Ve,
  legend_weather: Ze,
  legend_now: Ke,
  tooltip_mowing: Xe,
  tooltip_weather: Je,
  show_weather_exclusions: Ye
}, Qe = /* @__PURE__ */ Object.assign({
  "./translations/de.json": ve,
  "./translations/en.json": Ge
}), W = {};
for (const [o, t] of Object.entries(Qe)) {
  const e = o.match(/([a-z]{2})\.json$/)[1];
  W[e] = t;
}
function At(o) {
  const t = (o == null ? void 0 : o.language) || "en", e = t.split("-")[0];
  return W[t] || W[e] || W.en;
}
function h(o, t) {
  return t.split(".").reduce((e, s) => e == null ? void 0 : e[s], o) || t;
}
class K extends S {
  setConfig(t) {
    this._config = {
      ...f,
      ...t,
      entity: t.entity ?? f.entity,
      title: t.title ?? f.title
    };
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const t = At(this.hass), e = Vt(this.hass);
    return !this._config.entity && e.length > 0 && (this._config = {
      ...this._config,
      entity: e[0].value
    }), u`
      <div class="editor">
        <div class="field">
          ${this.renderForm(
      [
        {
          name: "entity",
          label: h(t, "entity"),
          required: !0,
          selector: {
            select: {
              mode: "dropdown",
              options: e
            }
          }
        },
        {
          name: "title",
          label: h(t, "title_field"),
          selector: {
            text: {}
          }
        }
      ],
      this._config
    )}
        </div>

        <div class="field grid-2">
          ${this.renderTextForm(
      "day_color",
      this._config.day_color,
      h(t, "day_color")
    )}
          ${this.renderTextForm(
      "day_text_color",
      this._config.day_text_color,
      h(t, "day_text_color")
    )}
        </div>

        <div class="field grid-2">
          ${this.renderTextForm(
      "slot_color",
      this._config.slot_color,
      h(t, "slot_color")
    )}
          ${this.renderTextForm(
      "now_color",
      this._config.now_color,
      h(t, "now_color")
    )}
        </div>

        <div class="field">
          ${this.renderForm(
      [
        {
          name: "highlight_today",
          label: h(t, "highlight_today"),
          selector: {
            boolean: {}
          }
        },
        {
          name: "today_border_color",
          label: h(t, "today_border_color"),
          selector: {
            text: {}
          }
        },
        {
          name: "show_weather_exclusions",
          label: h(t, "show_weather_exclusions"),
          selector: {
            boolean: {}
          }
        },
        {
          name: "weather_exclusion_color",
          label: h(t, "weather_exclusion_color"),
          selector: {
            text: {}
          }
        },
        {
          name: "show_next_mow",
          label: h(t, "show_next_mow"),
          selector: {
            boolean: {}
          }
        },
        {
          name: "show_legend",
          label: h(t, "show_legend"),
          selector: {
            boolean: {}
          }
        }
      ],
      this._config
    )}
        </div>
      </div>
    `;
  }
  renderTextForm(t, e, s) {
    return u`
      ${this.renderForm(
      [
        {
          name: t,
          label: s,
          selector: {
            text: {}
          }
        }
      ],
      { [t]: e }
    )}
    `;
  }
  renderForm(t, e) {
    return u`
      <ha-form
        .hass=${this.hass}
        .schema=${t}
        .data=${e}
        .computeLabel=${(s) => s.label || s.name}
        @value-changed=${(s) => this.handleValueChanged(s)}
      ></ha-form>
    `;
  }
  handleValueChanged(t) {
    this.updateConfig(t.detail.value);
  }
  updateConfig(t) {
    this._config = {
      ...this._config,
      ...t
    }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
}
P(K, "properties", {
  hass: { attribute: !1 },
  _config: { state: !0 }
}), P(K, "styles", gt`
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
  `);
customElements.get("indego-calendar-card-editor") || customElements.define("indego-calendar-card-editor", K);
const ts = `
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
class X extends S {
  static getConfigElement() {
    return document.createElement("indego-calendar-card-editor");
  }
  static getStubConfig() {
    return { ...f };
  }
  setConfig(t) {
    this.config = {
      ...f,
      ...t,
      entity: t.entity ?? f.entity,
      title: t.title ?? f.title
    };
  }
  getCardSize() {
    return 4;
  }
  getColors() {
    return {
      day: A(this.config.day_color, f.day_color),
      slot: A(this.config.slot_color, f.slot_color),
      now: A(this.config.now_color, f.now_color),
      todayBorder: A(
        this.config.today_border_color,
        f.today_border_color
      ),
      dayText: A(this.config.day_text_color, f.day_text_color),
      weatherExclusion: A(
        this.config.weather_exclusion_color,
        f.weather_exclusion_color
      )
    };
  }
  render() {
    if (!this.hass || !this.config) return u``;
    const t = At(this.hass), e = qt(this.hass, this.config.entity), s = e ? this.hass.states[e] : void 0;
    if (!s)
      return u`
        <ha-card>
          <div class="card">
            ${h(t, "entity_not_found")}: ${this.config.entity || ""}
          </div>
        </ha-card>
      `;
    const n = this.getColors(), i = s.attributes, r = this.config.title || h(t, "title"), l = this.renderSubtitle(t, i);
    return u`
      <ha-card>
        <div class="card">
          <div class="title">${r}</div>
          ${l ? u`<div class="subtitle">${l}</div>` : u``}

          <div class="scale">
            <div></div>
            <div class="scale-inner">
              <span style="left:0%;transform:translateX(0);">00</span>
              <span style="left:25%;">06</span>
              <span style="left:50%;">12</span>
              <span style="left:75%;">18</span>
              <span style="right:0%;transform:translateX(0);">24</span>
            </div>
          </div>

          ${Q.map((a) => this.renderDayRow(t, i, a, n))}
          ${this.config.show_legend ? this.renderLegend(t, n) : u``}
        </div>
      </ha-card>
    `;
  }
  renderSubtitle(t, e) {
    if (!this.config.show_next_mow) return "";
    if (e.next_mow_slot)
      return `${h(t, "subtitle_next_mow")}: ${e.next_mow_slot}`;
    if (e.next_mow_day && e.next_mow_time)
      return `${h(t, "subtitle_next_mow")}: ${h(
        t,
        e.next_mow_day
      )} ${e.next_mow_time}`;
    const s = Kt(e);
    return s ? `${h(t, "subtitle_next_mow")}: ${h(
      t,
      s.day
    )} ${s.slot}` : "";
  }
  renderDayRow(t, e, s, n) {
    const i = this.config.highlight_today && s === ht();
    return u`
      <div class="row">
        <div
          class="day"
          style="background:${n.day}; color:${n.dayText};"
        >
          ${h(t, s)}
        </div>

        <div
          class="track"
          style="
            border-color:${i ? n.todayBorder : "var(--divider-color)"};
            border-width:${i ? "2px" : "1px"};
          "
        >
          <div class="line" style="left:25%;"></div>
          <div class="line" style="left:50%;"></div>
          <div class="line" style="left:75%;"></div>

          ${vt(e, s).map(
      (r) => this.renderSlot(t, r, n.slot)
    )}
          ${this.config.show_weather_exclusions ? Zt(e, s).map(
      (r) => this.renderWeatherExclusion(t, r, n.weatherExclusion)
    ) : u``}
          ${this.renderNowLine(s, n.now)}
        </div>
      </div>
    `;
  }
  renderSlot(t, e, s) {
    const n = ut(e);
    return n ? u`
      <div
        class="slot"
        title="${h(t, "tooltip_mowing")}: ${e}"
        style="
          left:${n.left}%;
          width:${n.width}%;
          background:${s};
        "
      ></div>
    ` : u``;
  }
  renderWeatherExclusion(t, e, s) {
    const n = ut(e);
    return n ? u`
      <div
        class="weather-exclusion"
        title="${h(t, "tooltip_weather")}: ${e}"
        style="
          left:${n.left}%;
          width:${n.width}%;
          background-color:${s};
        "
      ></div>
    ` : u``;
  }
  renderNowLine(t, e) {
    if (t !== ht()) return u``;
    const s = /* @__PURE__ */ new Date(), i = (s.getHours() * 60 + s.getMinutes()) / 1440 * 100;
    return u`
      <div
        class="now-line"
        style="left:${i}%; background:${e};"
      ></div>
    `;
  }
  renderLegend(t, e) {
    return u`
      <div class="legend">
        <div class="legend-item">
          <span class="legend-box" style="background:${e.slot};"></span>
          <span>${h(t, "legend_mowing")}</span>
        </div>

        <div class="legend-item">
          <span
            class="legend-box legend-weather"
            style="background-color:${e.weatherExclusion};"
          ></span>
          <span>${h(t, "legend_weather")}</span>
        </div>

        <div class="legend-item">
          <span class="legend-now" style="background:${e.now};"></span>
          <span>${h(t, "legend_now")}</span>
        </div>
      </div>
    `;
  }
}
P(X, "properties", {
  hass: {},
  config: { state: !0 }
}), P(X, "styles", gt`
    ${ft(ts)}
  `);
customElements.get("indego-calendar-card") || customElements.define("indego-calendar-card", X);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "indego-calendar-card",
  name: "Indego Calendar",
  description: "Displays scheduled mowing windows as a weekly calendar.",
  preview: !0
});

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partial = exports.PartialType = exports.type = exports.InterfaceType = exports.array = exports.ArrayType = exports.recursion = exports.RecursiveType = exports.Int = exports.brand = exports.RefinementType = exports.keyof = exports.KeyofType = exports.literal = exports.LiteralType = exports.void = exports.undefined = exports.null = exports.UnknownRecord = exports.AnyDictionaryType = exports.UnknownArray = exports.AnyArrayType = exports.boolean = exports.BooleanType = exports.bigint = exports.BigIntType = exports.number = exports.NumberType = exports.string = exports.StringType = exports.unknown = exports.UnknownType = exports.voidType = exports.VoidType = exports.UndefinedType = exports.nullType = exports.NullType = exports.getIndex = exports.getTags = exports.emptyTags = exports.mergeAll = exports.getDomainKeys = exports.appendContext = exports.getContextEntry = exports.getFunctionName = exports.identity = exports.Type = exports.success = exports.failure = exports.failures = void 0;
exports.alias = exports.clean = exports.StrictType = exports.dictionary = exports.object = exports.ObjectType = exports.Dictionary = exports.getDefaultContext = exports.getValidationError = exports.interface = exports.Array = exports.taggedUnion = exports.TaggedUnionType = exports.Integer = exports.refinement = exports.any = exports.AnyType = exports.never = exports.NeverType = exports.Function = exports.FunctionType = exports.exact = exports.ExactType = exports.strict = exports.readonlyArray = exports.ReadonlyArrayType = exports.readonly = exports.ReadonlyType = exports.tuple = exports.TupleType = exports.intersection = exports.IntersectionType = exports.union = exports.UnionType = exports.record = exports.DictionaryType = void 0;
/**
 * @since 1.0.0
 */
var Either_1 = require("fp-ts/lib/Either");
/**
 * @category Decode error
 * @since 1.0.0
 */
exports.failures = Either_1.left;
/**
 * @category Decode error
 * @since 1.0.0
 */
var failure = function (value, context, message) {
    return (0, exports.failures)([{ value: value, context: context, message: message }]);
};
exports.failure = failure;
/**
 * @category Decode error
 * @since 1.0.0
 */
exports.success = Either_1.right;
/**
 * @category Codec
 * @since 1.0.0
 */
var Type = /** @class */ (function () {
    function Type(
    /** a unique name for this codec */
    name, 
    /** a custom type guard */
    is, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate, 
    /** converts a value of type A to a value of type O */
    encode) {
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.encode = encode;
        this.decode = this.decode.bind(this);
    }
    /**
     * @since 1.0.0
     */
    Type.prototype.pipe = function (ab, name) {
        var _this = this;
        if (name === void 0) { name = "pipe(".concat(this.name, ", ").concat(ab.name, ")"); }
        return new Type(name, ab.is, function (i, c) {
            var e = _this.validate(i, c);
            if ((0, Either_1.isLeft)(e)) {
                return e;
            }
            return ab.validate(e.right, c);
        }, this.encode === exports.identity && ab.encode === exports.identity ? exports.identity : function (b) { return _this.encode(ab.encode(b)); });
    };
    /**
     * @since 1.0.0
     */
    Type.prototype.asDecoder = function () {
        return this;
    };
    /**
     * @since 1.0.0
     */
    Type.prototype.asEncoder = function () {
        return this;
    };
    /**
     * a version of `validate` with a default context
     * @since 1.0.0
     */
    Type.prototype.decode = function (i) {
        return this.validate?.(i, [{ key: '', type: this, actual: i }]);
    };
    return Type;
}());
exports.Type = Type;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 1.0.0
 */
var identity = function (a) { return a; };
exports.identity = identity;
/**
 * @since 1.0.0
 */
function getFunctionName(f) {
    return f.displayName || f.name || "<function".concat(f.length, ">");
}
exports.getFunctionName = getFunctionName;
/**
 * @since 1.0.0
 */
function getContextEntry(key, decoder) {
    return { key: key, type: decoder };
}
exports.getContextEntry = getContextEntry;
/**
 * @since 1.0.0
 */
function appendContext(c, key, decoder, actual) {
    var len = c.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key: key, type: decoder, actual: actual };
    return r;
}
exports.appendContext = appendContext;
function pushAll(xs, ys) {
    var l = ys.length;
    for (var i = 0; i < l; i++) {
        xs.push(ys[i]);
    }
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function getNameFromProps(props) {
    return Object.keys(props)
        .map(function (k) { return "".concat(k, ": ").concat(props[k]?.name); })
        .join(', ');
}
function useIdentity(codecs) {
    for (var i = 0; i < codecs.length; i++) {
        if (codecs[i]?.encode !== exports.identity) {
            return false;
        }
    }
    return true;
}
function getInterfaceTypeName(props) {
    return "{ ".concat(getNameFromProps(props), " }");
}
function getPartialTypeName(inner) {
    return "Partial<".concat(inner, ">");
}
function enumerableRecord(keys, domain, codomain, name) {
    if (name === void 0) { name = "{ [K in ".concat(domain.name, "]: ").concat(codomain.name, " }"); }
    var len = keys.length;
    var props = {};
    for (var i = 0; i < len; i++) {
        props[keys[i]] = codomain;
    }
    var exactCodec = (0, exports.strict)(props, name);
    return new DictionaryType(name, function (u) { return exactCodec.is(u); }, exactCodec.validate, exactCodec.encode, domain, codomain);
}
/**
 * @internal
 */
function getDomainKeys(domain) {
    var _a;
    if (isLiteralC(domain)) {
        var literal_1 = domain.value;
        if (exports.string.is(literal_1)) {
            return _a = {}, _a[literal_1] = null, _a;
        }
    }
    else if (isKeyofC(domain)) {
        return domain.keys;
    }
    else if (isUnionC(domain)) {
        var keys = domain.types.map(function (type) { return getDomainKeys(type); });
        return keys.some(undefinedType.is) ? undefined : Object.assign.apply(Object, __spreadArray([{}], keys, false));
    }
    return undefined;
}
exports.getDomainKeys = getDomainKeys;
function stripNonDomainKeys(o, domain) {
    var keys = Object.keys(o);
    var len = keys.length;
    var shouldStrip = false;
    var r = {};
    for (var i = 0; i < len; i++) {
        var k = keys[i];
        if (domain.is(k)) {
            r[k] = o[k];
        }
        else {
            shouldStrip = true;
        }
    }
    return shouldStrip ? r : o;
}
function nonEnumerableRecord(domain, codomain, name) {
    if (name === void 0) { name = "{ [K in ".concat(domain.name, "]: ").concat(codomain.name, " }"); }
    return new DictionaryType(name, function (u) {
        if (exports.UnknownRecord.is(u)) {
            return Object.keys(u).every(function (k) { return !domain.is(k) || codomain.is(u[k]); });
        }
        return isAnyC(codomain) && Array.isArray(u);
    }, function (u, c) {
        if (exports.UnknownRecord.is(u)) {
            var a = {};
            var errors = [];
            var keys = Object.keys(u);
            var len = keys.length;
            var changed = false;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ok = u[k];
                var domainResult = domain.validate(k, appendContext(c, k, domain, k));
                if ((0, Either_1.isLeft)(domainResult)) {
                    changed = true;
                }
                else {
                    var vk = domainResult.right;
                    changed = changed || vk !== k;
                    k = vk;
                    var codomainResult = codomain.validate(ok, appendContext(c, k, codomain, ok));
                    if ((0, Either_1.isLeft)(codomainResult)) {
                        pushAll(errors, codomainResult.left);
                    }
                    else {
                        var vok = codomainResult.right;
                        changed = changed || vok !== ok;
                        a[k] = vok;
                    }
                }
            }
            return errors.length > 0 ? (0, exports.failures)(errors) : (0, exports.success)((changed ? a : u));
        }
        if (isAnyC(codomain) && Array.isArray(u)) {
            return (0, exports.success)(u);
        }
        return (0, exports.failure)(u, c);
    }, domain.encode === exports.identity && codomain.encode === exports.identity
        ? function (a) { return stripNonDomainKeys(a, domain); }
        : function (a) {
            var s = {};
            var keys = Object.keys(stripNonDomainKeys(a, domain));
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                s[String(domain.encode(k))] = codomain.encode(a[k]);
            }
            return s;
        }, domain, codomain);
}
function getUnionName(codecs) {
    return '(' + codecs.map(function (type) { return type.name; }).join(' | ') + ')';
}
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function mergeAll(base, us) {
    var equal = true;
    var primitive = true;
    var baseIsNotADictionary = !exports.UnknownRecord.is(base);
    for (var _i = 0, us_1 = us; _i < us_1.length; _i++) {
        var u = us_1[_i];
        if (u !== base) {
            equal = false;
        }
        if (exports.UnknownRecord.is(u)) {
            primitive = false;
        }
    }
    if (equal) {
        return base;
    }
    else if (primitive) {
        return us[us.length - 1];
    }
    var r = {};
    for (var _a = 0, us_2 = us; _a < us_2.length; _a++) {
        var u = us_2[_a];
        for (var k in u) {
            if (!hasOwnProperty.call(r, k) || baseIsNotADictionary || u[k] !== base[k]) {
                r[k] = u[k];
            }
        }
    }
    return r;
}
exports.mergeAll = mergeAll;
function getProps(codec) {
    switch (codec._tag) {
        case 'RefinementType':
        case 'ReadonlyType':
            return getProps(codec.type);
        case 'InterfaceType':
        case 'StrictType':
        case 'PartialType':
            return codec.props;
        case 'IntersectionType':
            return codec.types.reduce(function (props, type) { return Object.assign(props, getProps(type)); }, {});
    }
}
function stripKeys(o, props) {
    var keys = Object.getOwnPropertyNames(o);
    var shouldStrip = false;
    var r = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!hasOwnProperty.call(props, key)) {
            shouldStrip = true;
        }
        else {
            r[key] = o[key];
        }
    }
    return shouldStrip ? r : o;
}
function getExactTypeName(codec) {
    if (isTypeC(codec)) {
        return "{| ".concat(getNameFromProps(codec.props), " |}");
    }
    else if (isPartialC(codec)) {
        return getPartialTypeName("{| ".concat(getNameFromProps(codec.props), " |}"));
    }
    return "Exact<".concat(codec.name, ">");
}
function isNonEmpty(as) {
    return as.length > 0;
}
/**
 * @internal
 */
exports.emptyTags = {};
function intersect(a, b) {
    var r = [];
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var v = a_1[_i];
        if (b.indexOf(v) !== -1) {
            r.push(v);
        }
    }
    return r;
}
function mergeTags(a, b) {
    if (a === exports.emptyTags) {
        return b;
    }
    if (b === exports.emptyTags) {
        return a;
    }
    var r = Object.assign({}, a);
    for (var k in b) {
        if (hasOwnProperty.call(a, k)) {
            var intersection_1 = intersect(a[k], b[k]);
            if (isNonEmpty(intersection_1)) {
                r[k] = intersection_1;
            }
            else {
                r = exports.emptyTags;
                break;
            }
        }
        else {
            r[k] = b[k];
        }
    }
    return r;
}
function intersectTags(a, b) {
    if (a === exports.emptyTags || b === exports.emptyTags) {
        return exports.emptyTags;
    }
    var r = exports.emptyTags;
    for (var k in a) {
        if (hasOwnProperty.call(b, k)) {
            var intersection_2 = intersect(a[k], b[k]);
            if (intersection_2.length === 0) {
                if (r === exports.emptyTags) {
                    r = {};
                }
                r[k] = a[k].concat(b[k]);
            }
        }
    }
    return r;
}
// tslint:disable-next-line: deprecation
function isAnyC(codec) {
    return codec._tag === 'AnyType';
}
function isLiteralC(codec) {
    return codec._tag === 'LiteralType';
}
function isKeyofC(codec) {
    return codec._tag === 'KeyofType';
}
function isTypeC(codec) {
    return codec._tag === 'InterfaceType';
}
function isPartialC(codec) {
    return codec._tag === 'PartialType';
}
// tslint:disable-next-line: deprecation
function isStrictC(codec) {
    return codec._tag === 'StrictType';
}
function isExactC(codec) {
    return codec._tag === 'ExactType';
}
// tslint:disable-next-line: deprecation
function isRefinementC(codec) {
    return codec._tag === 'RefinementType';
}
function isIntersectionC(codec) {
    return codec._tag === 'IntersectionType';
}
function isUnionC(codec) {
    return codec._tag === 'UnionType';
}
function isRecursiveC(codec) {
    return codec._tag === 'RecursiveType';
}
var lazyCodecs = [];
/**
 * @internal
 */
function getTags(codec) {
    if (lazyCodecs.indexOf(codec) !== -1) {
        return exports.emptyTags;
    }
    if (isTypeC(codec) || isStrictC(codec)) {
        var index = exports.emptyTags;
        // tslint:disable-next-line: forin
        for (var k in codec.props) {
            var prop = codec.props[k];
            if (isLiteralC(prop)) {
                if (index === exports.emptyTags) {
                    index = {};
                }
                index[k] = [prop.value];
            }
        }
        return index;
    }
    else if (isExactC(codec) || isRefinementC(codec)) {
        return getTags(codec.type);
    }
    else if (isIntersectionC(codec)) {
        return codec.types.reduce(function (tags, codec) { return mergeTags(tags, getTags(codec)); }, exports.emptyTags);
    }
    else if (isUnionC(codec)) {
        return codec.types.slice(1).reduce(function (tags, codec) { return intersectTags(tags, getTags(codec)); }, getTags(codec.types[0]));
    }
    else if (isRecursiveC(codec)) {
        lazyCodecs.push(codec);
        var tags = getTags(codec.type);
        lazyCodecs.pop();
        return tags;
    }
    return exports.emptyTags;
}
exports.getTags = getTags;
/**
 * @internal
 */
function getIndex(codecs) {
    var tags = getTags(codecs[0]);
    var keys = Object.keys(tags);
    var len = codecs.length;
    var _loop_1 = function (k) {
        var all = tags[k].slice();
        var index = [tags[k]];
        for (var i = 1; i < len; i++) {
            var codec = codecs[i];
            var ctags = getTags(codec);
            var values = ctags[k];
            // tslint:disable-next-line: strict-type-predicates
            if (values === undefined) {
                return "continue-keys";
            }
            else {
                if (values.some(function (v) { return all.indexOf(v) !== -1; })) {
                    return "continue-keys";
                }
                else {
                    all.push.apply(all, values);
                    index.push(values);
                }
            }
        }
        return { value: [k, index] };
    };
    keys: for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        var state_1 = _loop_1(k);
        if (typeof state_1 === "object")
            return state_1.value;
        switch (state_1) {
            case "continue-keys": continue keys;
        }
    }
    return undefined;
}
exports.getIndex = getIndex;
// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------
/**
 * @since 1.0.0
 */
var NullType = /** @class */ (function (_super) {
    __extends(NullType, _super);
    function NullType() {
        var _this = _super.call(this, 'null', function (u) { return u === null; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'NullType';
        return _this;
    }
    return NullType;
}(Type));
exports.NullType = NullType;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.nullType = new NullType();
exports.null = exports.nullType;
/**
 * @since 1.0.0
 */
var UndefinedType = /** @class */ (function (_super) {
    __extends(UndefinedType, _super);
    function UndefinedType() {
        var _this = _super.call(this, 'undefined', function (u) { return u === void 0; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'UndefinedType';
        return _this;
    }
    return UndefinedType;
}(Type));
exports.UndefinedType = UndefinedType;
var undefinedType = new UndefinedType();
exports.undefined = undefinedType;
/**
 * @since 1.2.0
 */
var VoidType = /** @class */ (function (_super) {
    __extends(VoidType, _super);
    function VoidType() {
        var _this = _super.call(this, 'void', undefinedType.is, undefinedType.validate, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'VoidType';
        return _this;
    }
    return VoidType;
}(Type));
exports.VoidType = VoidType;
/**
 * @category primitives
 * @since 1.2.0
 */
exports.voidType = new VoidType();
exports.void = exports.voidType;
/**
 * @since 1.5.0
 */
var UnknownType = /** @class */ (function (_super) {
    __extends(UnknownType, _super);
    function UnknownType() {
        var _this = _super.call(this, 'unknown', function (_) { return true; }, exports.success, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'UnknownType';
        return _this;
    }
    return UnknownType;
}(Type));
exports.UnknownType = UnknownType;
/**
 * @category primitives
 * @since 1.5.0
 */
exports.unknown = new UnknownType();
/**
 * @since 1.0.0
 */
var StringType = /** @class */ (function (_super) {
    __extends(StringType, _super);
    function StringType() {
        var _this = _super.call(this, 'string', function (u) { return typeof u === 'string'; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'StringType';
        return _this;
    }
    return StringType;
}(Type));
exports.StringType = StringType;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.string = new StringType();
/**
 * @since 1.0.0
 */
var NumberType = /** @class */ (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        var _this = _super.call(this, 'number', function (u) { return typeof u === 'number'; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'NumberType';
        return _this;
    }
    return NumberType;
}(Type));
exports.NumberType = NumberType;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.number = new NumberType();
/**
 * @since 2.1.0
 */
var BigIntType = /** @class */ (function (_super) {
    __extends(BigIntType, _super);
    function BigIntType() {
        var _this = _super.call(this, 'bigint', 
        // tslint:disable-next-line: valid-typeof
        function (u) { return typeof u === 'bigint'; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'BigIntType';
        return _this;
    }
    return BigIntType;
}(Type));
exports.BigIntType = BigIntType;
/**
 * @category primitives
 * @since 2.1.0
 */
exports.bigint = new BigIntType();
/**
 * @since 1.0.0
 */
var BooleanType = /** @class */ (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        var _this = _super.call(this, 'boolean', function (u) { return typeof u === 'boolean'; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'BooleanType';
        return _this;
    }
    return BooleanType;
}(Type));
exports.BooleanType = BooleanType;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.boolean = new BooleanType();
/**
 * @since 1.0.0
 */
var AnyArrayType = /** @class */ (function (_super) {
    __extends(AnyArrayType, _super);
    function AnyArrayType() {
        var _this = _super.call(this, 'UnknownArray', Array.isArray, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'AnyArrayType';
        return _this;
    }
    return AnyArrayType;
}(Type));
exports.AnyArrayType = AnyArrayType;
/**
 * @category primitives
 * @since 1.7.1
 */
exports.UnknownArray = new AnyArrayType();
exports.Array = exports.UnknownArray;
/**
 * @since 1.0.0
 */
var AnyDictionaryType = /** @class */ (function (_super) {
    __extends(AnyDictionaryType, _super);
    function AnyDictionaryType() {
        var _this = _super.call(this, 'UnknownRecord', function (u) { return u !== null && typeof u === 'object' && !Array.isArray(u); }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'AnyDictionaryType';
        return _this;
    }
    return AnyDictionaryType;
}(Type));
exports.AnyDictionaryType = AnyDictionaryType;
/**
 * @category primitives
 * @since 1.7.1
 */
exports.UnknownRecord = new AnyDictionaryType();
/**
 * @since 1.0.0
 */
var LiteralType = /** @class */ (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(name, is, validate, encode, value) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.value = value;
        /**
         * @since 1.0.0
         */
        _this._tag = 'LiteralType';
        return _this;
    }
    return LiteralType;
}(Type));
exports.LiteralType = LiteralType;
/**
 * @category constructors
 * @since 1.0.0
 */
function literal(value, name) {
    if (name === void 0) { name = JSON.stringify(value); }
    var is = function (u) { return u === value; };
    return new LiteralType(name, is, function (u, c) { return (is(u) ? (0, exports.success)(value) : (0, exports.failure)(u, c)); }, exports.identity, value);
}
exports.literal = literal;
/**
 * @since 1.0.0
 */
var KeyofType = /** @class */ (function (_super) {
    __extends(KeyofType, _super);
    function KeyofType(name, is, validate, encode, keys) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.keys = keys;
        /**
         * @since 1.0.0
         */
        _this._tag = 'KeyofType';
        return _this;
    }
    return KeyofType;
}(Type));
exports.KeyofType = KeyofType;
/**
 * @category constructors
 * @since 1.0.0
 */
function keyof(keys, name) {
    if (name === void 0) { name = Object.keys(keys)
        .map(function (k) { return JSON.stringify(k); })
        .join(' | '); }
    var is = function (u) { return exports.string.is(u) && hasOwnProperty.call(keys, u); };
    return new KeyofType(name, is, function (u, c) { return (is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity, keys);
}
exports.keyof = keyof;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 1.0.0
 */
var RefinementType = /** @class */ (function (_super) {
    __extends(RefinementType, _super);
    function RefinementType(name, is, validate, encode, type, predicate) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this.predicate = predicate;
        /**
         * @since 1.0.0
         */
        _this._tag = 'RefinementType';
        return _this;
    }
    return RefinementType;
}(Type));
exports.RefinementType = RefinementType;
/**
 * @category combinators
 * @since 1.8.1
 */
function brand(codec, predicate, name) {
    return refinement(codec, predicate, name);
}
exports.brand = brand;
/**
 * A branded codec representing an integer
 *
 * @category primitives
 * @since 1.8.1
 */
exports.Int = brand(exports.number, function (n) { return Number.isInteger(n); }, 'Int');
/**
 * @since 1.0.0
 */
var RecursiveType = /** @class */ (function (_super) {
    __extends(RecursiveType, _super);
    function RecursiveType(name, is, validate, encode, runDefinition) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.runDefinition = runDefinition;
        /**
         * @since 1.0.0
         */
        _this._tag = 'RecursiveType';
        return _this;
    }
    return RecursiveType;
}(Type));
exports.RecursiveType = RecursiveType;
Object.defineProperty(RecursiveType.prototype, 'type', {
    get: function () {
        return this.runDefinition();
    },
    enumerable: true,
    configurable: true
});
/**
 * @category combinators
 * @since 1.0.0
 */
function recursion(name, definition) {
    var cache;
    var runDefinition = function () {
        if (!cache) {
            cache = definition(Self);
            cache.name = name;
        }
        return cache;
    };
    var Self = new RecursiveType(name, function (u) { return runDefinition().is(u); }, function (u, c) { return runDefinition().validate(u, c); }, function (a) { return runDefinition().encode(a); }, runDefinition);
    return Self;
}
exports.recursion = recursion;
/**
 * @since 1.0.0
 */
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        /**
         * @since 1.0.0
         */
        _this._tag = 'ArrayType';
        return _this;
    }
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
/**
 * @category combinators
 * @since 1.0.0
 */
function array(item, name) {
    if (name === void 0) { name = "Array<".concat(item.name, ">"); }
    return new ArrayType(name, function (u) { return exports.UnknownArray.is(u) && u.every(item.is); }, function (u, c) {
        var e = exports.UnknownArray.validate(u, c);
        if ((0, Either_1.isLeft)(e)) {
            return e;
        }
        var us = e.right;
        var len = us.length;
        var as = us;
        var errors = [];
        for (var i = 0; i < len; i++) {
            var ui = us[i];
            var result = item.validate(ui, appendContext(c, String(i), item, ui));
            if ((0, Either_1.isLeft)(result)) {
                pushAll(errors, result.left);
            }
            else {
                var ai = result.right;
                if (ai !== ui) {
                    if (as === us) {
                        as = us.slice();
                    }
                    as[i] = ai;
                }
            }
        }
        return errors.length > 0 ? (0, exports.failures)(errors) : (0, exports.success)(as);
    }, item.encode === exports.identity ? exports.identity : function (a) { return a.map(item.encode); }, item);
}
exports.array = array;
/**
 * @since 1.0.0
 */
var InterfaceType = /** @class */ (function (_super) {
    __extends(InterfaceType, _super);
    function InterfaceType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        /**
         * @since 1.0.0
         */
        _this._tag = 'InterfaceType';
        return _this;
    }
    return InterfaceType;
}(Type));
exports.InterfaceType = InterfaceType;
/**
 * @category combinators
 * @since 1.0.0
 */
function type(props, name) {
    if (name === void 0) { name = getInterfaceTypeName(props); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new InterfaceType(name, function (u) {
        if (exports.UnknownRecord.is(u)) {
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var uk = u[k];
                if ((uk === undefined && !hasOwnProperty.call(u, k)) || !types[i].is(uk)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }, function (u, c) {
        var e = exports.UnknownRecord.validate(u, c);
        if ((0, Either_1.isLeft)(e)) {
            return e;
        }
        var o = e.right;
        var a = o;
        var errors = [];
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            var ak = a[k];
            var type_1 = types[i];
            var result = type_1.validate(ak, appendContext(c, k, type_1, ak));
            if ((0, Either_1.isLeft)(result)) {
                pushAll(errors, result.left);
            }
            else {
                var vak = result.right;
                if (vak !== ak || (vak === undefined && !hasOwnProperty.call(a, k))) {
                    /* istanbul ignore next */
                    if (a === o) {
                        a = __assign({}, o);
                    }
                    a[k] = vak;
                }
            }
        }
        return errors.length > 0 ? (0, exports.failures)(errors) : (0, exports.success)(a);
    }, useIdentity(types)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var encode = types[i].encode;
                if (encode !== exports.identity) {
                    s[k] = encode(a[k]);
                }
            }
            return s;
        }, props);
}
exports.type = type;
exports.interface = type;
/**
 * @since 1.0.0
 */
var PartialType = /** @class */ (function (_super) {
    __extends(PartialType, _super);
    function PartialType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        /**
         * @since 1.0.0
         */
        _this._tag = 'PartialType';
        return _this;
    }
    return PartialType;
}(Type));
exports.PartialType = PartialType;
/**
 * @category combinators
 * @since 1.0.0
 */
function partial(props, name) {
    if (name === void 0) { name = getPartialTypeName(getInterfaceTypeName(props)); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new PartialType(name, function (u) {
        if (exports.UnknownRecord.is(u)) {
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var uk = u[k];
                if (uk !== undefined && !props[k].is(uk)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }, function (u, c) {
        var e = exports.UnknownRecord.validate(u, c);
        if ((0, Either_1.isLeft)(e)) {
            return e;
        }
        var o = e.right;
        var a = o;
        var errors = [];
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            var ak = a[k];
            var type_2 = props[k];
            var result = type_2.validate(ak, appendContext(c, k, type_2, ak));
            if ((0, Either_1.isLeft)(result)) {
                if (ak !== undefined) {
                    pushAll(errors, result.left);
                }
            }
            else {
                var vak = result.right;
                if (vak !== ak) {
                    /* istanbul ignore next */
                    if (a === o) {
                        a = __assign({}, o);
                    }
                    a[k] = vak;
                }
            }
        }
        return errors.length > 0 ? (0, exports.failures)(errors) : (0, exports.success)(a);
    }, useIdentity(types)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ak = a[k];
                if (ak !== undefined) {
                    s[k] = types[i].encode(ak);
                }
            }
            return s;
        }, props);
}
exports.partial = partial;
/**
 * @since 1.0.0
 */
var DictionaryType = /** @class */ (function (_super) {
    __extends(DictionaryType, _super);
    function DictionaryType(name, is, validate, encode, domain, codomain) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.domain = domain;
        _this.codomain = codomain;
        /**
         * @since 1.0.0
         */
        _this._tag = 'DictionaryType';
        return _this;
    }
    return DictionaryType;
}(Type));
exports.DictionaryType = DictionaryType;
/**
 * @category combinators
 * @since 1.7.1
 */
function record(domain, codomain, name) {
    var keys = getDomainKeys(domain);
    return keys
        ? enumerableRecord(Object.keys(keys), domain, codomain, name)
        : nonEnumerableRecord(domain, codomain, name);
}
exports.record = record;
/**
 * @since 1.0.0
 */
var UnionType = /** @class */ (function (_super) {
    __extends(UnionType, _super);
    function UnionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        /**
         * @since 1.0.0
         */
        _this._tag = 'UnionType';
        return _this;
    }
    return UnionType;
}(Type));
exports.UnionType = UnionType;
/**
 * @category combinators
 * @since 1.0.0
 */
function union(codecs, name) {
    if (name === void 0) { name = getUnionName(codecs); }
    var index = getIndex(codecs);
    if (index !== undefined && codecs.length > 0) {
        var tag_1 = index[0], groups_1 = index[1];
        var len_1 = groups_1.length;
        var find_1 = function (value) {
            for (var i = 0; i < len_1; i++) {
                if (groups_1[i].indexOf(value) !== -1) {
                    return i;
                }
            }
            return undefined;
        };
        // tslint:disable-next-line: deprecation
        return new TaggedUnionType(name, function (u) {
            if (exports.UnknownRecord.is(u)) {
                var i = find_1(u[tag_1]);
                return i !== undefined ? codecs[i].is(u) : false;
            }
            return false;
        }, function (u, c) {
            var e = exports.UnknownRecord.validate(u, c);
            if ((0, Either_1.isLeft)(e)) {
                return e;
            }
            var r = e.right;
            var i = find_1(r[tag_1]);
            if (i === undefined) {
                return (0, exports.failure)(u, c);
            }
            var codec = codecs[i];
            return codec.validate(r, appendContext(c, String(i), codec, r));
        }, useIdentity(codecs)
            ? exports.identity
            : function (a) {
                var i = find_1(a[tag_1]);
                if (i === undefined) {
                    // https://github.com/gcanti/io-ts/pull/305
                    throw new Error("no codec found to encode value in union codec ".concat(name));
                }
                else {
                    return codecs[i].encode(a);
                }
            }, codecs, tag_1);
    }
    else {
        return new UnionType(name, function (u) { return codecs.some(function (type) { return type.is(u); }); }, function (u, c) {
            var errors = [];
            for (var i = 0; i < codecs.length; i++) {
                var codec = codecs[i];
                var result = codec.validate(u, appendContext(c, String(i), codec, u));
                if ((0, Either_1.isLeft)(result)) {
                    pushAll(errors, result.left);
                }
                else {
                    return (0, exports.success)(result.right);
                }
            }
            return (0, exports.failures)(errors);
        }, useIdentity(codecs)
            ? exports.identity
            : function (a) {
                for (var _i = 0, codecs_1 = codecs; _i < codecs_1.length; _i++) {
                    var codec = codecs_1[_i];
                    if (codec.is(a)) {
                        return codec.encode(a);
                    }
                }
                // https://github.com/gcanti/io-ts/pull/305
                throw new Error("no codec found to encode value in union type ".concat(name));
            }, codecs);
    }
}
exports.union = union;
/**
 * @since 1.0.0
 */
var IntersectionType = /** @class */ (function (_super) {
    __extends(IntersectionType, _super);
    function IntersectionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        /**
         * @since 1.0.0
         */
        _this._tag = 'IntersectionType';
        return _this;
    }
    return IntersectionType;
}(Type));
exports.IntersectionType = IntersectionType;
function intersection(codecs, name) {
    if (name === void 0) { name = "(".concat(codecs.map(function (type) { return type.name; }).join(' & '), ")"); }
    var len = codecs.length;
    return new IntersectionType(name, function (u) { return codecs.every(function (type) { return type.is(u); }); }, codecs.length === 0
        ? exports.success
        : function (u, c) {
            var us = [];
            var errors = [];
            for (var i = 0; i < len; i++) {
                var codec = codecs[i];
                var result = codec.validate(u, appendContext(c, String(i), codec, u));
                if ((0, Either_1.isLeft)(result)) {
                    pushAll(errors, result.left);
                }
                else {
                    us.push(result.right);
                }
            }
            return errors.length > 0 ? (0, exports.failures)(errors) : (0, exports.success)(mergeAll(u, us));
        }, codecs.length === 0
        ? exports.identity
        : function (a) {
            return mergeAll(a, codecs.map(function (codec) { return codec.encode(a); }));
        }, codecs);
}
exports.intersection = intersection;
/**
 * @since 1.0.0
 */
var TupleType = /** @class */ (function (_super) {
    __extends(TupleType, _super);
    function TupleType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        /**
         * @since 1.0.0
         */
        _this._tag = 'TupleType';
        return _this;
    }
    return TupleType;
}(Type));
exports.TupleType = TupleType;
function tuple(codecs, name) {
    if (name === void 0) { name = "[".concat(codecs.map(function (type) { return type.name; }).join(', '), "]"); }
    var len = codecs.length;
    return new TupleType(name, function (u) { return exports.UnknownArray.is(u) && u.length === len && codecs.every(function (type, i) { return type.is(u[i]); }); }, function (u, c) {
        var e = exports.UnknownArray.validate(u, c);
        if ((0, Either_1.isLeft)(e)) {
            return e;
        }
        var us = e.right;
        var as = us.length > len ? us.slice(0, len) : us; // strip additional components
        var errors = [];
        for (var i = 0; i < len; i++) {
            var a = us[i];
            var type_3 = codecs[i];
            var result = type_3.validate(a, appendContext(c, String(i), type_3, a));
            if ((0, Either_1.isLeft)(result)) {
                pushAll(errors, result.left);
            }
            else {
                var va = result.right;
                if (va !== a) {
                    /* istanbul ignore next */
                    if (as === us) {
                        as = us.slice();
                    }
                    as[i] = va;
                }
            }
        }
        return errors.length > 0 ? (0, exports.failures)(errors) : (0, exports.success)(as);
    }, useIdentity(codecs) ? exports.identity : function (a) { return codecs.map(function (type, i) { return type.encode(a[i]); }); }, codecs);
}
exports.tuple = tuple;
/**
 * @since 1.0.0
 */
var ReadonlyType = /** @class */ (function (_super) {
    __extends(ReadonlyType, _super);
    function ReadonlyType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        /**
         * @since 1.0.0
         */
        _this._tag = 'ReadonlyType';
        return _this;
    }
    return ReadonlyType;
}(Type));
exports.ReadonlyType = ReadonlyType;
/**
 * @category combinators
 * @since 1.0.0
 */
function readonly(codec, name) {
    if (name === void 0) { name = "Readonly<".concat(codec.name, ">"); }
    return new ReadonlyType(name, codec.is, codec.validate, codec.encode, codec);
}
exports.readonly = readonly;
/**
 * @since 1.0.0
 */
var ReadonlyArrayType = /** @class */ (function (_super) {
    __extends(ReadonlyArrayType, _super);
    function ReadonlyArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        /**
         * @since 1.0.0
         */
        _this._tag = 'ReadonlyArrayType';
        return _this;
    }
    return ReadonlyArrayType;
}(Type));
exports.ReadonlyArrayType = ReadonlyArrayType;
/**
 * @category combinators
 * @since 1.0.0
 */
function readonlyArray(item, name) {
    if (name === void 0) { name = "ReadonlyArray<".concat(item.name, ">"); }
    var codec = array(item);
    return new ReadonlyArrayType(name, codec.is, codec.validate, codec.encode, item);
}
exports.readonlyArray = readonlyArray;
/**
 * Strips additional properties, equivalent to `exact(type(props))`.
 *
 * @category combinators
 * @since 1.0.0
 */
var strict = function (props, name) { return exact(type(props), name); };
exports.strict = strict;
/**
 * @since 1.1.0
 */
var ExactType = /** @class */ (function (_super) {
    __extends(ExactType, _super);
    function ExactType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        /**
         * @since 1.0.0
         */
        _this._tag = 'ExactType';
        return _this;
    }
    return ExactType;
}(Type));
exports.ExactType = ExactType;
/**
 * Strips additional properties.
 *
 * @category combinators
 * @since 1.1.0
 */
function exact(codec, name) {
    if (name === void 0) { name = getExactTypeName(codec); }
    var props = getProps(codec);
    return new ExactType(name, codec.is, function (u, c) {
        var e = exports.UnknownRecord.validate(u, c);
        if ((0, Either_1.isLeft)(e)) {
            return e;
        }
        var ce = codec.validate(u, c);
        if ((0, Either_1.isLeft)(ce)) {
            return ce;
        }
        return (0, Either_1.right)(stripKeys(ce.right, props));
    }, function (a) { return codec.encode(stripKeys(a, props)); }, codec);
}
exports.exact = exact;
/**
 * @since 1.0.0
 */
var FunctionType = /** @class */ (function (_super) {
    __extends(FunctionType, _super);
    function FunctionType() {
        var _this = _super.call(this, 'Function', 
        // tslint:disable-next-line:strict-type-predicates
        function (u) { return typeof u === 'function'; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'FunctionType';
        return _this;
    }
    return FunctionType;
}(Type));
exports.FunctionType = FunctionType;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.Function = new FunctionType();
/**
 * @since 1.0.0
 */
var NeverType = /** @class */ (function (_super) {
    __extends(NeverType, _super);
    function NeverType() {
        var _this = _super.call(this, 'never', function (_) { return false; }, function (u, c) { return (0, exports.failure)(u, c); }, 
        /* istanbul ignore next */
        function () {
            throw new Error('cannot encode never');
        }) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'NeverType';
        return _this;
    }
    return NeverType;
}(Type));
exports.NeverType = NeverType;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.never = new NeverType();
/**
 * @since 1.0.0
 */
var AnyType = /** @class */ (function (_super) {
    __extends(AnyType, _super);
    function AnyType() {
        var _this = _super.call(this, 'any', function (_) { return true; }, exports.success, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'AnyType';
        return _this;
    }
    return AnyType;
}(Type));
exports.AnyType = AnyType;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.any = new AnyType();
function refinement(codec, predicate, name) {
    if (name === void 0) { name = "(".concat(codec.name, " | ").concat(getFunctionName(predicate), ")"); }
    return new RefinementType(name, function (u) { return codec.is(u) && predicate(u); }, function (i, c) {
        var e = codec.validate(i, c);
        if ((0, Either_1.isLeft)(e)) {
            return e;
        }
        var a = e.right;
        return predicate(a) ? (0, exports.success)(a) : (0, exports.failure)(a, c);
    }, codec.encode, codec, predicate);
}
exports.refinement = refinement;
/**
 * @category primitives
 * @since 1.0.0
 */
exports.Integer = refinement(exports.number, Number.isInteger, 'Integer');
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * @since 1.3.0
 * @deprecated
 */
var TaggedUnionType = /** @class */ (function (_super) {
    __extends(TaggedUnionType, _super);
    function TaggedUnionType(name, 
    // tslint:disable-next-line: deprecation
    is, 
    // tslint:disable-next-line: deprecation
    validate, 
    // tslint:disable-next-line: deprecation
    encode, codecs, tag) {
        var _this = _super.call(this, name, is, validate, encode, codecs) /* istanbul ignore next */ // <= workaround for https://github.com/Microsoft/TypeScript/issues/13455
         || this;
        _this.tag = tag;
        return _this;
    }
    return TaggedUnionType;
}(UnionType));
exports.TaggedUnionType = TaggedUnionType;
/**
 * Use `union` instead.
 *
 * @category combinators
 * @since 1.3.0
 * @deprecated
 */
var taggedUnion = function (tag, codecs, name
// tslint:disable-next-line: deprecation
) {
    if (name === void 0) { name = getUnionName(codecs); }
    var U = union(codecs, name);
    // tslint:disable-next-line: deprecation
    if (U instanceof TaggedUnionType) {
        return U;
    }
    else {
        console.warn("[io-ts] Cannot build a tagged union for ".concat(name, ", returning a de-optimized union"));
        // tslint:disable-next-line: deprecation
        return new TaggedUnionType(name, U.is, U.validate, U.encode, codecs, tag);
    }
};
exports.taggedUnion = taggedUnion;
/**
 * @since 1.0.0
 * @deprecated
 */
var getValidationError /* istanbul ignore next */ = function (value, context) { return ({
    value: value,
    context: context
}); };
exports.getValidationError /* istanbul ignore next */ = getValidationError;
/**
 * @since 1.0.0
 * @deprecated
 */
var getDefaultContext /* istanbul ignore next */ = function (decoder) { return [
    { key: '', type: decoder }
]; };
exports.getDefaultContext /* istanbul ignore next */ = getDefaultContext;
/**
 * Use `UnknownRecord` instead.
 *
 * @category primitives
 * @since 1.0.0
 * @deprecated
 */
exports.Dictionary = exports.UnknownRecord;
/**
 * @since 1.0.0
 * @deprecated
 */
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType() {
        var _this = _super.call(this, 'object', function (u) { return u !== null && typeof u === 'object'; }, function (u, c) { return (_this.is(u) ? (0, exports.success)(u) : (0, exports.failure)(u, c)); }, exports.identity) || this;
        /**
         * @since 1.0.0
         */
        _this._tag = 'ObjectType';
        return _this;
    }
    return ObjectType;
}(Type));
exports.ObjectType = ObjectType;
/**
 * Use `UnknownRecord` instead.
 *
 * @category primitives
 * @since 1.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
exports.object = new ObjectType();
/**
 * Use `record` instead.
 *
 * @category combinators
 * @since 1.0.0
 * @deprecated
 */
exports.dictionary = record;
/**
 * @since 1.0.0
 * @deprecated
 */
var StrictType = /** @class */ (function (_super) {
    __extends(StrictType, _super);
    function StrictType(name, 
    // tslint:disable-next-line: deprecation
    is, 
    // tslint:disable-next-line: deprecation
    validate, 
    // tslint:disable-next-line: deprecation
    encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        /**
         * @since 1.0.0
         */
        _this._tag = 'StrictType';
        return _this;
    }
    return StrictType;
}(Type));
exports.StrictType = StrictType;
/**
 * Drops the codec "kind".
 *
 * @category combinators
 * @since 1.1.0
 * @deprecated
 */
function clean(codec) {
    return codec;
}
exports.clean = clean;
function alias(codec) {
    return function () { return codec; };
}
exports.alias = alias;

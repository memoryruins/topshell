//: (a -> b) -> List a -> List b
exports.map = function(f) {
    return function(r) {
        var result = [];
        for(var i = 0; i < r.length; i++) {
            var a = f(r[i]);
            result.push(a);
        }
        return result;
    };
};

//: (a -> List b) -> List a -> List b
exports.then = function(f) {
    return function(r) {
        var result = [];
        for(var i = 0; i < r.length; i++) {
            var a = f(r[i]);
            for(var j = 0; j < a.length; j++) {
                result.push(a[j]);
            }
        }
        return result;
    };
};

//: Int -> Int -> List Int
exports.range = function(start) {
    return function(stop) {
        var result = [];
        for(var i = start; i <= stop; i++) {
            result.push(i);
        }
        return result;
    };
};

//: (a -> [None, Some {key: a, value: b}]) -> a -> List b
exports.unfold = f => z => {
    var result = [];
    var e = null;
    while(self.tsh.isSome(e = f(z))) {
        z = e._1.key;
        result.push(e._1.value);
    }
    return result;
};

//: List a -> Int
exports.size = function(r) { return r.length; };
//: List a -> Bool
exports.isEmpty = function(r) { return r.length === 0; };
//: List a
exports.empty = [];
//: Int -> List a -> [None, Some a]
exports.at = function(i) { return function(r) { return i >= 0 && i < r.length ? self.tsh.some(r[i]) : self.tsh.none; }; };
//: Int -> List a -> List a
exports.take = function(i) { return function(r) { return r.slice(0, i); }; };
//: Int -> List a -> List a
exports.drop = function(i) { return function(r) { return r.slice(i); }; };
//: Int -> List a -> List a
exports.takeLast = function(i) { return function(r) { return i === 0 ? [] : r.slice(-i); }; };
//: Int -> List a -> List a
exports.dropLast = function(i) { return function(r) { return i === 0 ? r : r.slice(0, -i); }; };

//: (a -> Bool) -> List a -> List a
exports.filter = function(f) { return function(r) { return r.filter(f); }; };
//: List a -> List a
exports.reverse = function(r) { return r.slice().reverse(); };
//: (a -> Bool) -> List a -> [None, Some a]
exports.find = f => r => {
    for(var i = 0; i < r.length; i++) {
        if(f(r[i])) return self.tsh.some(r[i]);
    }
    return self.tsh.none;
};
//: (a -> Bool) -> List a -> Bool
exports.all = function(f) { return function(r) { return r.every(f); }; };
//: (a -> Bool) -> List a -> Bool
exports.any = function(f) { return function(r) { return r.some(f); }; };

//: List a -> [None, Some a]
exports.head = function(r) { return r.length > 0 ? self.tsh.some(r[0]) : self.tsh.none; };
//: List a -> List a
exports.tail = function(r) { return r.slice(1); };

//: a -> (a -> b -> a) -> List b -> a
exports.foldLeft = z => f => a => a.reduce((x, y) => f(x)(y), z);

//: a -> (a -> b -> a) -> List b -> a
exports.foldRight = z => f => a => a.reduceRight((x, y) => f(x)(y), z);

//: List a -> List a | Order a
exports.sort = a => exports.sortBy(x => y => XOrder.less(x, y))(a);
//: (a -> b) -> List a -> List a | Order b
exports.sortOn = f => a => exports.sortBy(x => y => XOrder.less(f(x), f(y)))(a);
//: (a -> a -> Bool) -> List a -> List a
exports.sortBy = f => a => a.slice().sort((a, b) => f(a)(b) ? -1 : f(b)(a) ? 1 : 0);

//: Int -> a -> List a
exports.repeat = n => v => new Array(n).fill(v);

//: List (List a) -> List (List a)
exports.transpose = a => a[0].map((_, i) => a.flatMap(row => i < row.length ? [row[i]] : []));

//: List (List a) -> List a
exports.flatten = l => {
    var result = [];
    for(var i = 0; i < l.length; i++) {
        var inner = l[i];
        for(var j = 0; j < inner.length; j++) {
            result.push(inner[j]);
        }
    }
    return result;
};
//: (a -> List b) -> List a -> List b
exports.flatMap = exports.then;

//: (a -> b -> c) -> List a -> List b -> List c
exports.zip = f => a => b => {
    let result = [];
    for(var i = 0; i < a.length && i < b.length; i++) {
        result.push(f(a[i])(b[i]));
    }
    return result;
};

//: r1 -> List r2 | {r1 : List x, r2 : x}
exports.zipped = structure => {
    var list = [];
    var i = 0;
    while(true) {
        var o = Array.isArray(structure) ? [] : {};
        var any = false;
        for(var k in structure) if(Object.prototype.hasOwnProperty.call(structure, k)) {
            var v = structure[k];
            if(i >= v.length) return list;
            o[k] = v[i];
            any = true;
        }
        if(!any) return list;
        list.push(o);
        i++;
    }
};

//: (a -> Bool) -> List a -> List a
exports.takeWhile = f => a => {
    let result = [];
    for(var i = 0; i < a.length; i++) {
        if(!f(a[i])) return result;
        result.push(a[i]);
    }
    return result;
};

//: (a -> Bool) -> List a -> List a
exports.takeLastWhile = f => a => {
    let result = [];
    for(var j = a.length - 1; j >= 0 && f(a[j]); j--) {}
    for(var i = j + 1; i < a.length; i++) {
        result.push(a[i]);
    }
    return result;
};

//: (a -> Bool) -> List a -> List a
exports.dropWhile = f => a => {
    let result = [];
    for(var j = 0; j < a.length && f(a[j]); j++) {}
    for(var i = j; i < a.length; i++) {
        result.push(a[i]);
    }
    return result;
};

//: (a -> Bool) -> List a -> List a
exports.dropLastWhile = f => a => {
    let result = [];
    for(var j = a.length - 1; j >= 0 && f(a[j]); j--) {}
    for(var i = 0; i <= j; i++) {
        result.push(a[i]);
    }
    return result;
};

//: List {key: a, value: b} -> {key: List a, value: List b}
exports.unzip = a => {
    let keys = [];
    let values = [];
    for(var i = 0; i < a.length; i++) {
        keys.push(a[i].key);
        values.push(a[i].key);
    }
    return {key: keys, value: values};
};

//: List a -> List {key: Int, value: a}
exports.withKeys = a => a.map((e, i) => ({key: i, value: e}));

//: List a -> List Int
exports.keys = a => a.map((e, i) => i);

//: (a -> b -> a) -> a -> List b -> List a
exports.scanLeft = f => z => a => {
    let result = new Array(a.length);
    for(var i = 0; i < a.length; i++) {
        z = f(z)(a[i]);
        result[i] = z;
    }
    return result;
};

//: (a -> b -> b) -> b -> List a -> List b
exports.scanRight = f => z => a => {
    let result = new Array(a.length);
    for(var i = a.length - 1; i >= 0; i--) {
        z = f(a[i])(z);
        result[i] = z;
    }
    return result;
};

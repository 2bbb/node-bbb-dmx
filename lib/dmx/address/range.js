class Range {
    constructor(from, to) {
        this.private = {
            from: Math.min(from, to),
            to:   Math.max(from, to)
        };
    }

    get from() { return this.private.from; }
    get to() { return this. private.to; }
    get length() { return this.to - this.from + 1; }

    crossTo(other) {
        return Range.crossed(this, other);
    }

    static crossed(lhs, rhs) {
        return !((lhs.to < rhs.from) || (rhs.to < lhs.from));
    }

    static compare(lhs, rhs) {
        if(lhs.from == rhs.from) {
            if(lhs.to == rhs.to) {
                return 0;
            } else if(lhs.to < rhs.to) {
                return -1;
            } else {
                return 1;
            }
        } else if(lhs.from < rhs.from) {
            return -1;
        } else {
            return 1;
        }
    }
};

module.exports = Range;
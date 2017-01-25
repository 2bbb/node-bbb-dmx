class Timer {
    constructor(duration) {
        this.start = new Date();
        this.duration = duration;
    }
    get fire () {
        const now = new Date();
        const e = (now - this.start) * 0.001;
        if(this.duration < e) {
            this.start = now;
            return true;
        } else {
            return false;
        }
    }
    get reset() {
        this.start = new Date();
    }
};

module.exports = (scenes, duration, opt = { loop: true, direction: 0, random: false }) => {
    const { loop, direction } = opt;
    const context = {
        scenes,
        timer: new Timer(duration),
        counter: (direction == -1) ? (scenes.length - 1) : 0,
        loop,
        direction,
        offset: (direction == -1) ? -1 : 1
    };

    if(loop) {
        return () => {
            if(context.timer.fire) {
                console.log(context.counter, context.scenes.length);
                context.scenes[context.counter]();
                context.counter += context.offset;
                if(context.direction == 0) {
                    if(context.counter < 0) {
                        context.counter = 1;
                        context.offset = 1;
                    } else if(context.scenes.length <= context.counter) {
                        context.counter = context.scenes.length - 1;
                        context.offset = -1;
                    }
                } else {
                    context.counter = (context.counter + context.scenes.length) % context.scenes.length;
                }
            }
        };
    } else {
        return (elapsed, remove) => {
            if(context.timer.fire) {
                context.scenes[context.counter]();
                context.counter++
                if(context.counter == context.scenes.length) remove();
            }
        };
    }
};
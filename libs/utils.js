global.log = (m) => {
    if (!process.env.NODE_ENV ? 'development' : process.env.NODE_ENV !== 'production') {
        console.log(m);
    }
};
global.useMem = () => {
    const mem = process.memoryUsage();
    const format = bytes => `${(bytes / 1024 / 1024).toFixed(2)}MB`;
    console.log(`Process: heapTotal ${format(mem.heapTotal)} heapUsed ${format(mem.heapUsed)} rss ${format(mem.rss)}`);
};

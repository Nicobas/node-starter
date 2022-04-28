const logger = require('winston');

module.exports = () => {
    logger.info('[EXPRESS STATUS] Initializing status route');

    const { app, serviceName } = SERVICE;

    const startDate = new Date();

    app.get('/status', (req, res) => {
        const currentDate = new Date();

        const uptimeData = convertMS(currentDate.getTime() - startDate.getTime());
        const uptime =
            (uptimeData.day > 0 ? uptimeData.day + ' days ' : '') +
            (uptimeData.hour > 0 ? uptimeData.hour + ' hours ' : '') +
            (uptimeData.minute > 0 ? uptimeData.minute + ' minutes ' : '') +
            (uptimeData.second > 0 ? uptimeData.second + ' seconds' : '');

        res.status(200).json({
            status: 'UP',
            service: serviceName,
            env_type: CONFIG.env_type,
            env_name: CONFIG.env_name,
            uptime: uptime,
            uptime_ms: currentDate.getTime() - startDate.getTime(),
            date: currentDate.toString(),
            date_iso: currentDate.toISOString(),
            remote_ip: req.clientIp,
        });
    });
};

const convertMS = (milliseconds) => {
    let day, hour, minute, second;
    second = Math.floor(milliseconds / 1000);
    minute = Math.floor(second / 60);
    second = second % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        second: second,
    };
};

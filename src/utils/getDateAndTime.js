const getDateAndTime = (dateStr) => {
    const _date = dateStr.substring(0, 10);
    const [year, month, day] = _date.split('-');

    const _time = dateStr.substring(dateStr.indexOf('T') + 1);
    const [h, m, s] = _time.split(':');

    return [`${day}.${month}.${year}г`, `${h}:${m}`];
}

export default getDateAndTime;
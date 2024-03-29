const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 区分过期演出和未过期演出
const checkShowExpired = (_this, shows) => {
	const currentTime = new Date();
	const upcomingShows = [];
	const expiredShows = [];

	shows.forEach(show => {
		const date = show.date.split('/');
		const startHour = show.start_time.split(':')[0];
		const startMin = show.start_time.split(':')[1];
		const startTime = new Date(
			Number.parseInt(date[0], 10),
			Number.parseInt(date[1] - 1, 10),
			Number.parseInt(date[2], 10),
			Number.parseInt(startHour, 10),
			Number.parseInt(startMin, 10)
		);

		if (currentTime.getTime() > startTime.getTime()) {
			// this show is expired
			expiredShows.unshift(show);
		} else {
			// this show is upcoming
			// upcomingShows.unshift(show);
			upcomingShows.push(show);
		}
	})

	_this.setData({ upcomingShows, expiredShows });
}

// 获取当前日期
const fetchCurrentDate = () =>  {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const date = now.getDate();

	return `${year}/${month}/${date}`;
}

module.exports = {
	formatTime,
	checkShowExpired,
  fetchCurrentDate
}

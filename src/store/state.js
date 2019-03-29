let defaultCity = '上海'
let defaultHeader='欢迎来到数据可视化学习'
try {
    if (localStorage.city) {
        defaultCity = localStorage.city
    }
    if (localStorage.header) {
        defaultHeader = localStorage.header
    }
} catch (e) {
}

export default {
    city: defaultCity,
    header: defaultHeader
}

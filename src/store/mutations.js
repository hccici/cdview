export default {
    changeCity(state, city) {
        state.city = city;
        try {
            localStorage.city = city
        } catch (e) {
            'ss'
        }
    },
    changeHeader(state, changeV) {
        state.header = changeV
        try {
            localStorage.header = changeV
        } catch (e) {
            'ss'
        }
    }
}

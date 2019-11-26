export default {
    initialState: {
        name: {value: ''},
        chineseName: {value: ''},
        lowercaseName: {value: ''},
        capitalName: {value: ''},
        allCapitalName: {value: ''},
        pluralityName: {value: ''},
        permissionPrefix: {value: ''},
        showMore: false,
        ajaxPrefix: {value: ''},
        routePath: {value: ''},
    },

    syncStorage: true,

    setFields: (fields) => ({...fields}),
}

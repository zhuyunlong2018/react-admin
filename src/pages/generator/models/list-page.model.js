export default {
    initialState: {
        outPutDir: {value: void 0},
        outPutFile: {value: void 0},
        template: {value: 'templates/list-edit-ajax/list.ejs'},
        fields: {value: [{id: 'init-field', title: '', dataIndex: ''}]},
        queryItems: {value: []},
        toolItems: {value: []},
        bottomToolItems: {value: []},

        loading: false,
    },

    syncStorage: true,

    setFields: (fields) => ({...fields}),
}

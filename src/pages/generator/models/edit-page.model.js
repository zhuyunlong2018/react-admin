export default {
    initialState: {
        outPutDir: {value: void 0},
        outPutFile: {value: void 0},
        template: {value: 'templates/list-edit-ajax/edit.ejs'},
        fields: {value: [{id: 'init-field', title: '', dataIndex: ''}]},

        loading: false,
    },

    syncStorage: true,

    setFields: (fields) => ({...fields}),
}

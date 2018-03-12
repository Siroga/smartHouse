module.exports = {
	tableName: 'settings',
	attributes: {
		id: {
		    type: 'string',
			columnName: 'key',
			primaryKey: true,
		},
		value: {
		    columnName: 'value',
		    type: 'string'
		}
	},
	autoCreatedAt: false,
	autoUpdatedAt: false

	
};

module.exports = {
	tableName: 'groups',
	attributes: {
		id: {
		    columnName: 'id',
		    type: 'integer',
		    primaryKey: true,
		    autoIncrement: true
		},
		value: {
		    columnName: 'name',
		    type: 'string'
		}
	},
	autoCreatedAt: false,
	autoUpdatedAt: false

	
};

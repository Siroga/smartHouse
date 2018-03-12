module.exports = {
	tableName: 'logs',
	attributes: {
		id: {
			type: 'integer',
			columnName: 'id',
			primaryKey: true,
			autoIncrement: true
		},
		deviceId: {
            columnName: 'device_id',
		    model: 'device'
		},
		status: {
			type: 'integer',
			columnName: 'status'
		}
	},
	autoCreatedAt: true,
	autoUpdatedAt: false

	
};

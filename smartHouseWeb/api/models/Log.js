module.exports = {
	tableName: 'Logs',
	attributes: {
		id: {
			type: 'integer',
			columnName: 'id',
			primaryKey: true,
			uniqu: true
		},
		deviceId: {
			type: 'integer',
			columnName: 'device_id'
		},
		status: {
			type: 'integer',
			columnName: 'status'
		},
		dateTime: {
			type: 'dateTime',
			columnName: 'date_time'
		},
	},
	autoCreatedAt: true,
	autoUpdatedAt: true

	
};

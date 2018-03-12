module.exports = {
    tableName: 'temperatures',
	attributes: {
	    id: {
	        columnName: 'id',
			type: 'integer',
			primaryKey: true,
			autoIncrement: true
		},
	    deviceId: {
            columnName: 'device_id',
	        model: 'device'
		},
	    value: {
	        columnName: 'value',
	        type: 'float'
		}
	},
	autoCreatedAt: true,
	autoUpdatedAt: false

	
};

module.exports = {
    tableName: 'schedules',
	attributes: {
		id: {
			type: 'integer',
			columnName: 'id',
			primaryKey: true,
			autoIncrement: true
		},
		groupId: {
            columnName: 'group_id',
		    model: 'group'
		},
		day: {
			type: 'integer',
			columnName: 'day'
		},
		startTime: {
		    type: 'time',
		    columnName: 'startTime'
		},
		endTime: {
		    type: 'time',
		    columnName: 'endTime'
		},
		value: {
		    columnName: 'value',
		    type: 'float'
		}
	},
	autoCreatedAt: false,
	autoUpdatedAt: false,
    
	getCurrentTemp: function (groupId) {
	    schedule.findOne({
	        where: { deviceId: sails.config.webConfig.boilerId },
	        sort: 'createdAt DESC'
	    }).exec(function (err, res) {
	        if (err || !res) {
	            return callback(null);
	        }
	        else {
	            return callback(res.status);
	        }
	    });

	}

	
};

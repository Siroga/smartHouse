module.exports = {
    tableName: 'devices',
	attributes: {
	    id: {
	        columnName: 'id',
			type: 'integer',
			primaryKey: true,
			autoIncrement: true
		},
	    name: {
	        columnName: 'name',
	        type: 'string'
	    },
	    groupId: {
            columnName: 'group_id',
	        model: 'group'
	    },
	    ip: {
	        columnName: 'ip',
	        type: 'string'
	    },
	    hash: {
	        columnName: 'hash',
	        type: 'string'
		}
	},
	autoCreatedAt: false,
	autoUpdatedAt: false

	
};

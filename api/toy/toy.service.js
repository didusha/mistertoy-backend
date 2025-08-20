import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
	query,
	getById,
	remove,
	add,
	update,
	addToyMsg,
	removeToyMsg,
}

async function query(filterBy = {}) {
	try {
		const { filter, sort, collation } = _buildCriteria(filterBy)
		
		const collection = await dbService.getCollection('toy')
        const toys = await collection.find(filter, { sort, collation }).toArray()
		return toys
	} catch (err) {
		logger.error('cannot find toys', err)
		throw err
	}
}

async function getById(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
		toy.createdAt = toy._id.getTimestamp()
		return toy
	} catch (err) {
		logger.error(`while finding toy ${toyId}`, err)
		throw err
	}
}

async function remove(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
		return deletedCount
	} catch (err) {
		logger.error(`cannot remove toy ${toyId}`, err)
		throw err
	}
}

async function add(toy) {
	try {
		const collection = await dbService.getCollection('toy')
		//TODO: need to add createdAt? 
		// toy.createdAt = Date.now()
		await collection.insertOne(toy)
		return toy
	} catch (err) {
		logger.error('cannot insert toy', err)
		throw err
	}
}

async function update(toy) {
	try {
		const toyToSave = {
			name: toy.name,
			price: toy.price,
			inStock: toy.inStock,
			labels: toy.labels,
			imgUrl: toy.imgUrl,
			createdAt: toy.createdAt,
		}
		logger.info(toyToSave)
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: toyToSave })
		return toy
	} catch (err) {
		logger.error(`cannot update toy ${toy._id}`, err)
		throw err
	}
}

async function addToyMsg(toyId, msg) {
	try {
		msg.id = utilService.makeId()
		
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $push: { msgs: msg } })
		return msg
	} catch (err) {
		logger.error(`cannot add toy msg ${toyId}`, err)
		throw err
	}
}

async function removeToyMsg(toyId, msgId) {
	try {
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $pull: { msgs: { id: msgId } } })
		return msgId
	} catch (err) {
		logger.error(`cannot add toy msg ${toyId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const filter = {}
    if (filterBy.txt) {
        filter.name = { $regex: filterBy.txt, $options: 'i' }
    }
	
	if (filterBy.maxPrice) filter.price = { "$lt": filterBy.maxPrice }

    if (filterBy.inStock !=="all") {
		if(filterBy.inStock === 'true') filter.inStock = true
		else filter.inStock = false
    }

    if (filterBy.labels && filterBy.labels.length) {
        filter.labels = { $all: filterBy.labels }
    }
	
    const sort = {}
    const sortBy = filterBy.sortField
    if (sortBy) {
		const sortDirection = +filterBy.sortDir
        const sortField = sortBy === 'createdAt' ? '_id' : sortBy
        sort[sortField] = sortDirection
    } else sort._id = -1

    const collation = { locale: 'en' }
    return { filter, sort, collation }
}

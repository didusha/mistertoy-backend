
import fs from 'fs'
import { utilService } from './util.service.js'
import { logger } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 5
const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { txt: '' }) {
    let filteredToys = [...toys]
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredToys = filteredToys.filter(toy => regExp.test(toy.name))

    }
    if (filterBy.maxPrice) {
        filteredToys = filteredToys.filter(toy => toy.price <= filterBy.maxPrice)
    }

    if (filterBy.labels && filterBy.labels.length > 0) {
        filteredToys = filteredToys.filter(toy => toy.labels.some(label => filterBy.labels.includes(label)))
    }

    if (filterBy.inStock === 'true') {
        filteredToys = filteredToys.filter(toy => toy.inStock === true)
    } else if (filterBy.inStock === 'false') {
        filteredToys = filteredToys.filter(toy => toy.inStock === false)
    }

    if (filterBy.sortField) {
        if (filterBy.sortField === 'price') {
            filteredToys.sort((b1, b2) => (b1.price - b2.price) * filterBy.sortDir)
        } else if (filterBy.sortField === 'name') {
            filteredToys.sort((b1, b2) => b1.name.localeCompare(b2.name) * filterBy.sortDir)
        } else if (filterBy.sortField === 'createdAt') {
            // filteredToys.sort((b1, b2) => (new Date(b1.createdAt) - new Date(b2.createdAt)) * sortDir)
            filteredToys.sort((b1, b2) => (b1.createdAt - b2.createdAt) * filterBy.sortDir)
        }
    }
    return Promise.resolve(filteredToys)
}

async function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return toy
}

function remove(toyId, loggedinUser) {
    const idx = toys.findIndex(toy => toy._id === toyId)

    if (idx === -1) return Promise.reject('No Such Toy')

    const toy = toys[idx]
    // if (!loggedinUser.isAdmin &&
    //     toy.owner._id !== loggedinUser._id) {
        // return Promise.reject('Not your toy')
    // }
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy, loggedinUser) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        // if (!loggedinUser.isAdmin &&
        //     toyToUpdate.owner._id !== loggedinUser._id) {
            // return Promise.reject('Not your toy')
        // }
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
        toyToUpdate.labels = toy.labels
        toyToUpdate.imgUrl = toy.imgUrl
        toyToUpdate.createdAt = toy.createdAt
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        // toy.owner = loggedinUser
        toys.push(toy)
    }
    // delete toy.owner.score
    return _saveToysToFile().then(() => toy)
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                logger.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
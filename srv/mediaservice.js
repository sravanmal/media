module.exports = async function () {
    this.before('CREATE', 'media', req => {
        console.log('Create called')
        console.log(JSON.stringify(req.data))
        req.data.url = `/MediaService/media(${req.data.ID})/content`
    })
}
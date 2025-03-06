//The function that matches the explicit words
function isGenuine(message){
    let galis = ["madharchod","madarchod","randi","ramdi","chinal","chhinal","bhosadi ke","bhosadike","bsdk","bhenchod","bhnchod","mc","bc"]
    if(message)
    for(let word in galis){
    if(message.match(galis[word])){
        message = "Not a good message"
        return message
    }}
    return message
}

module.exports = isGenuine
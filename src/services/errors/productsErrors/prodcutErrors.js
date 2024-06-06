const generateInvalidProductDataError = ({ title, description, price, thumbnail, code, stock, category }) => {
    return `Invalid product data:
    * title       : should be a non-empty String, received ${title} (${typeof title})
    * description : should be a non-empty String, received ${description} (${typeof description})
    * price       : should be a positive Number, received ${price} (${typeof price})
    * thumbnail   : should be a non-empty String, received ${thumbnail} (${typeof thumbnail})
    * code        : should be a non-empty String, received ${code} (${typeof code})
    * stock       : should be a positive Number, received ${stock} (${typeof stock})
    * category    : should be a non-empty String, received ${category} (${typeof category})`;
};

module.exports = { generateInvalidProductDataError };

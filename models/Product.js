const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true,
            required: [true, 'please provide product name'],
            maxlength: [50, 'Name can not be more than 50 characters']
        },
        price:{
            type: Number,
            required: [true , 'Please provide product price'],
            default: 0
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
            maxlength: [1000, 'Description can not be more than 1000 characters']
        },
        image: {
            type: String,
            default: '/uploads/example.jpeg',
        },
        category: {
            type: String,
            required: [true, 'Please provide product category'],
            enum: ['office','kitchen','bedroom']
        },
        company: {
            type: String,
            required: [true, 'please provide company'],
            enum: {
                values: ['ikea','liddy','marcos'],
                message: '{VALUE} is not supported'
            },
        },
        colors: {
            type: [String],
            default: ['#222'],
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        freeShipping: {
            type: Boolean,
            default: false,
        },
        inventory: {
            type: Number,
            required: true,
            default: 15
        },
        averageRating: {
            type: Number,
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});

// In deleteProduct controller we have uses Remove because it
// Trigers this pre method and if we have used delete then that will 
// not trigger this 

ProductSchema.pre('remove', async function name(next) {
    await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product',ProductSchema);
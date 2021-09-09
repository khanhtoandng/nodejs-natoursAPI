const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTour = (req, res, next) => {
    req.params.limit = 5;
    req.params.sort = '-ratingsAverage,price';
    req.params.fields = 'name,price,ratingsAverage,summary, difficulty';

    next();
}

exports.getAllTours = catchAsync(async (req, res) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});


exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    
});

exports.createTour = catchAsync(async (req, res) => {
    const newTour = await Tour.create(req.body);

    res.status(200).json({ 
        status: 'success',
        data: {
            tour: newTour,
        }
    });
    
});

exports.updateTour = catchAsync(async (req, res) =>{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res) =>{
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
   

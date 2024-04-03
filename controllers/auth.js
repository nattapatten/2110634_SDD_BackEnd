const User = require('../models/User');

exports.register = async (req, res, next) => {
    console.log("it is here register")
    try{
        const {studentID, name, email, password, phone, role} = req.body;

        //create user
        const user = await User.create({
            studentID,
            name,
            email,
            password,
            phone,
            role
        });

        //Create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success: true, token});
        sendTokenResponse(user, 200, res);

    } catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }

    
}

//Login users
exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    //validate email&password has been entered
    if(!email || !password){
        return res.status(400).json(
                {
                    success: false, 
                    msg: 'Please provide an email and password'
                }
            );
    }

    //Check for user
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return res.status(400).json(
            {
                success: false, 
                msg: 'Invalid credentials'
            }
        );
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(401).json(
            {
                success: false, 
                msg: 'Invalid credentials'
            }
        );
    }

    //Create token
    // const token = user.getSignedJwtToken();

    // res.status(200).json({
    //     success: true,
    //     token
    // });
    sendTokenResponse(user, 200, res);
    
}


//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}


//get current loggen in user
//route POST /api/v1/auth/me
//access private
exports.getMe = async (req, res, next) => {
    console.log("it is here get me")
    const user = await User.findById(req.user.id);
    res.status(200).json(
        {
            success: true,
            data: user
        }
    )
}

// Get all users
// route GET /api/v1/users
// access Private/Admin
exports.getUsers = async (req, res, next) => {
    console.log("it is here users")
    const user = await User.find();
    res.status(200).json(
        {
            success: true,
            data: user
        }
    )
};


// Update user details
// route PUT /api/v1/users/:id
// access Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};

// Delete user
// route DELETE /api/v1/users/:id
// access Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};





// {
//     "success": true,
//     "data": [
//         {
//             "_id": "660d69d73bbc1b4fa7959a97",
//             "name": "User_test8",
//             "email": "usertest8@gmail.com",
//             "role": "user",
//             "createdAt": "2024-04-03T14:38:15.617Z",
//             "__v": 0
//         },
//         {
//             "_id": "660d6ca6ab1029a278cef6f2",
//             "name": "admin1",
//             "email": "admin1@gmail.com",
//             "role": "admin",
//             "createdAt": "2024-04-03T14:50:14.493Z",
//             "__v": 0
//         },
//         {
//             "_id": "660d6efdd88c9cbb4dea269b",
//             "name": "admin2",
//             "email": "admin2@gmail.com",
//             "role": "admin",
//             "createdAt": "2024-04-03T15:00:13.058Z",
//             "__v": 0
//         },
//         {
//             "_id": "660d71521f4341fae89f4549",
//             "name": "admin3",
//             "email": "admin3@gmail.com",
//             "role": "admin",
//             "createdAt": "2024-04-03T15:10:10.918Z",
//             "__v": 0
//         },
//         {
//             "_id": "660d7208d0e9f00ee7f866be",
//             "name": "usertest1",
//             "email": "usertest1@gmail.com",
//             "role": "user",
//             "createdAt": "2024-04-03T15:13:12.115Z",
//             "__v": 0
//         },
//         {
//             "_id": "660d7517c201f48eec5622e0",
//             "name": "admin6",
//             "email": "admin6@gmail.com",
//             "role": "admin",
//             "createdAt": "2024-04-03T15:26:15.244Z",
//             "__v": 0
//         },
//         {
//             "_id": "660d75aaa8b53b6c2b42039b",
//             "studentID": "12345678",
//             "name": "admin7",
//             "email": "admin7@gmail.com",
//             "phone": "01-234-5678",
//             "role": "admin",
//             "createdAt": "2024-04-03T15:28:42.200Z",
//             "__v": 0
//         }
//     ]
// }
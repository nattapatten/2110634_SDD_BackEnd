const User = require('../models/User');
const nodemailer = require('nodemailer');


exports.register = async (req, res, next) => {
    try{
        const {studentID, name, email, password, phone, role } = req.body;
        
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits OTP
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        //create user
        const user = await User.create({
            studentID,
            name,
            email,
            password,
            phone,
            role,
            otp,
            otpExpire
        });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chuladashboard@gmail.com',
                pass: 'qguk esii abjv ykbl'
            }
        });
          
        const mailOptions = {
            from: 'chuladashboard@gmail.com',
            to: user.email,
            subject: 'Your OTP for registration',
            text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return next(error);
            } else {
                console.log('OTP Email sent: ' + info.response);
                res.status(200).json({ success: true, message: 'OTP sent to your email. Please verify to complete registration.' });
            }
        });

    } catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }
 
}

//Verify OTP at registration step
exports.verifyOtpRegistration = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

    if (!user) {
        // If OTP is invalid or expired
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please register again.' });
    }

    // OTP is valid, nullify OTP fields to prevent reuse
    user.otp = null;
    user.otpExpire = null;

    // await user.save();

    res.status(200).json({ success: true, message: 'OTP verified. Registration complete.' });
};

//Login OTP
// In controllers/auth.js
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Existing validation logic...
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(400).json(
            {
                success: false, 
                msg: 'Invalid credentials'
            }
        );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        // Existing invalid credentials logic...
    }

    // Generate OTP and save it with the user's record
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 6 digits OTP
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chuladashboard@gmail.com',
            pass: 'qguk esii abjv ykbl'
        }
    });
      
    const mailOptions = {
        from: 'chuladashboard@gmail.com',
        to: user.email,
        subject: 'Your OTP for login',
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return next(error);
        } else {
            console.log('OTP Email sent: ' + info.response);
            res.status(200).json({ success: true, message: 'OTP sent to your email. Please verify to complete login.' });
        }
    });
};

exports.verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });


    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // OTP is valid, nullify OTP fields to prevent reuse
    user.otp = null;
    user.otpExpire = null;

    // await user.save();
    
    // Proceed to log the user in (send JWT token)
    sendTokenResponse(user, 200, res);
};

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

// Logout
exports.logout = async (req, res, next) => {
   res.cookie('token','none',{
    expires: new Date(Date.now()+10*1000),
    httpOnly :true
   });

   res.status(200).json({
    success:true,
    data:{}
   });
};

// exports.logout = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         tokenBlacklist.push(token);
//         res.status(200).json({ success: true, message: 'Logged out successfully' });
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
//  };



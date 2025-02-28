const UserModel = require("../Model/user.model.js");
const ErrorHandler = require("../utilities/errorhandler.js");
const transporter = require("../utilities/Sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../utilities/cloudinary.js");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

require("dotenv").config({
  path: "../Config/.env",
});

async function CreateUSer(req, res) {
  const { Name, email, password } = req.body;

  const CheckUserPresent = await UserModel.findOne({
    email: email,
  });

  if (CheckUserPresent) {
    const error = new ErrorHandler("Already Present in DB", 400);

    return res.status(404).send({
      message: error.message,
      status: error.statusCode,
      success: false,
    });
  }

  const newUser = new UserModel({
    Name: Name,
    email: email,
    password: password,
  });
  // send mail
  // 1. Link (http://localhost:5173/activation/{token})
  // 2. send the above link as mail
  // 3. direct the user to activation page
  const data = {
    Name,
    email,
    password,
  };
  const token = generateToken(data);
  await transporter.sendMail({
    to: "jupitersorbeet@gmail.com",
    from: "tejasphthomas29@gmail.com",
    subject: "verification email from follow along project",
    text: "Text",
    html: `<h1>Hello world   http://localhost:5173/activation/${token} </h1>`,
  });

  await newUser.save();

  return res.send("User Created Successfully");
}

// 1. Check if there is any user already present with same creds
// 2. if yes/true send respinse as user already exists
// 3. if no /false cerate a user in database

const generateToken = (data) => {
  // jwt
  const token = jwt.sign(
    { name: data.name, email: data.email, id: data.id },
    process.env.SECRET_KEY
  );
  return token;
};
const verifyUser = (token) => {
  const verify = jwt.verify(token, process.env.SECRET_KEY);
  if (verify) {
    return verify;
  } else {
    return false;
  }
};

async function verifyUserController(req, res) {
  const { token } = req.params;
  try {
    if (verifyUser(token)) {
      return res
        .status(200)
        .cookie("token", token)
        .json({ token, success: true });
    }
    return res.status(403).send({ message: "token expired" });
  } catch (er) {
    return res.status(403).send({ message: er.message });
  }
}

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const checkUserPresentinDB = await UserModel.findOne({ email: email });
    if (checkUserPresentinDB) {
      return res.status(403).send({ message: "User already present" });
    }
    console.log(req.file, process.env.cloud_name);
    const ImageAddress = await cloudinary.uploader
      .upload(req.file.path, {
        folder: "uploads",
      })
      .then((result) => {
        fs.unlinkSync(req.file.path);
        return result.url;
      });

    console.log("url", ImageAddress);

    bcrypt.hash(password, 10, async function (err, hashedPassword) {
      try {
        if (err) {
          return res.status(403).send({ message: err.message });
        }
        await UserModel.create({
          Name: name,
          email,
          password: hashedPassword,
          avatar: {
            url: ImageAddress,
            public_id: `${email}_public_id`,
          },
        });

        return res.status(201).send({ message: "User created successfully.." });
      } catch (er) {
        return res.status(500).send({ message: er.message });
      }
    });

    //
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUserPresentinDB = await UserModel.findOne({ email: email });

    bcrypt.compare(
      password,
      checkUserPresentinDB.password,
      function (err, result) {
        // result == true
        if (err) {
          return res.status(403).send({ message: er.message, success: false });
        }
        let data = {
          id: checkUserPresentinDB._id,
          email,
          password: checkUserPresentinDB.password,
        };
        const token = generateToken(data);

        return res.status(200).cookie("token", token).send({
          message: "User logged in successfully..",
          success: true,
          token,
        });
      }
    );

    // return saying signup first
  } catch (er) {
    return res.status(403).send({ message: er.message, success: false });
  }
};

const getUSerData = async (req, res) => {
  const userId = req.UserId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).send({ message: "Send Valid User Id" });
    }

    const checkUserPresentinDB = await UserModel.findOne({ _id: userId });
    if (!checkUserPresentinDB) {
      return res
        .status(401)
        .send({ message: "Please Signup, user not present" });
    }

    return res.status(200).send({ data: checkUserPresentinDB });
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
};

const AddAddressController = async (req, res) => {
  const userId = req.UserId;
  console.log(req.UserId);
  const { city, country, add1, add2, zipCode, addressType } = req.body;
  try {
    const userFindOne = await UserModel.findOne({ _id: userId });
    if (!userFindOne) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    const userAddress = {
      country,
      city,
      add1,
      add2,
      zipCode,
      addressType,
    };

    userFindOne.address.push(userAddress);
    const response = await userFindOne.save();

    return res
      .status(201)
      .send({ message: "User Address Added", success: true, response });
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
};

const DeleteAddyController = async (req, res) => {
  const userId = req.UserId;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(401)
        .send({ message: "Un-Authorised please signup", sucess: false });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .send({ message: "Address Id is in-valid", sucess: false });
    }
    const checkIfUSerPresent = await UserModel.findOne({ _id: userId });
    if (!checkIfUSerPresent) {
      return res
        .status(401)
        .send({ message: "Un-Authorised please signup", sucess: false });
    }
    const response = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { address: { _id: id } } },
      { new: true }
    );
    return res
      .status(201)
      .send({ message: "User Address deleted", success: true, response });
  } catch (er) {
    return res.status(500).send({ message: er.message, sucess: false });
  }
};

const GetAddressConroller = async (req, res) => {
  const userId = req.UserId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).send({ message: "Please login, un-Authorised" });
    }
    const checkUser = await UserModel.findOne({ _id: userId }, { address: 1 });
    if (!checkUser) {
      return res.status(401).send({ message: "Please signup, un-Authorised" });
    }

    return res.status(200).send({
      userInfo: checkUser,
      message: "Success",
      success: true,
    });
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
};

module.exports = {
  CreateUSer,
  verifyUserController,
  signup,
  login,
  getUSerData,
  AddAddressController,
  DeleteAddyController,
  GetAddressConroller,
};

const mongoose = require('mongoose')
const User = require('../models/user.model')
const { isValidObjectId } = require('../utils/validation.utils')

const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;

        if (pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page and limit must be positive numbers'
            })
        }

        const skip = (pageNum - 1) * limitNum
        
        const total = await User.countDocuments()

        const users = await User.find()
            .select('-password -refreshToken')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 })

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Users not found.'
            })
        }

        const totalPages = Math.ceil(total / limitNum)

        return res.status(200).json({
            success: true,
            message: 'Users retrieved.',
            data: {
                users,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    pages: totalPages,
                    hasMore: pageNum < totalPages
                }
            }
        })

    } catch (err) {
        next(err)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id

        // if(!id || !id.match(/^[0-9a-fA-F]{24}$/)){
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid user ID format.'
        //     })
        // }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            })
        }

        const user = await User.findById(id).select('-password -refreshToken')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User retrieved.',
            data: user
        })

    } catch (err) {
        next(err)
    }
}

const updateUserRole = async (req, res, next) => {
    try {
        const adminId = req.user.id
        const id = req.params.id
        const role = req.body.role

        if (!isValidObjectId(id)) {
           return res.status(400).json({
             success: false,
             message: 'Invalid user ID.'
           })
        }

        if (adminId === id) {
          return res.status(400).json({
            success: false,
            message: 'Cannot modify own administrative role.'
          })
        }

        if (!role) {
          return res.status(400).json({
            success: false,
            message: 'Role is required.'
          })
        }
  
        const allowedRoles = ['user', 'admin']

        if (!allowedRoles.includes(role)) {
          return res.status(400).json({
            success: false,
            message: `Invalid role.`
          })
        }
  
        const user = await User.findByIdAndUpdate(
          id,
          { $set: {role: role }},
          { new: true, runValidators: true } 
        ).select('-password -refreshToken')
  
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found.'
          });
        }
  
        return res.status(200).json({
          success: true,
          message: `User role updated to ${role}.`,
          data: user
        })
      
    } catch (err) {
        next(err);
    }
}

const deactivateUser = async (req, res, next) => {
    try {
        const adminId = req.user.id
        const id = req.params.id

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            })
        }

        if (adminId === id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot deactivate own account'
            })
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: { isActive: false, refreshToken: null } },
            { new: true }
        ).select('-password -refreshToken')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User deactivated',
            data: user
        })

    } catch (err) {
        next(err)
    }
}

const activateUser = async (req, res, next) => {
    try {
        // const adminId = req.user.id
        const id = req.params.id

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            })
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: { isActive: true } },
            { new: true }
        ).select('-password -refreshToken')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User activated',
            data: user
        })

    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllUsers, 
    getUserById, 
    updateUserRole, 
    deactivateUser, 
    activateUser
}


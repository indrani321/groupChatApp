const path = require('path');
const db = require('../database/db');
const Group = require('../models/group');
const User = require('../models/user'); 

const { generateAccessToken } = require('../utils/token');

async function saveGroup(req, res) {
  try {
    const { groupname } = req.body;
    
    const createdGroup = await Group.create({ groupname: groupname});

    console.log('Group name saved:', createdGroup.groupname);
    
    res.status(200).json({ group: createdGroup });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to save group name' });
  }
}
async function joinGroup(req, res) {
  try {
    const { name } = req.body;
    const { id } = req.body;

    
    const user = await User.findOne({ name });
    const group = await Group.findOne({ id: id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({ message: `User ${name} joined the group`,groupname: group.groupname });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to join the group' });
  }
}





module.exports = {
  saveGroup,
  joinGroup,
  
};

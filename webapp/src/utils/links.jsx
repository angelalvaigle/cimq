import React from 'react';

import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { BsQuestionSquare } from 'react-icons/bs';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings } from 'react-icons/md';

const links = [
  {
    text: 'play',
    path: '.',
    icon: <BsQuestionSquare />,
  },
  {
    text: 'ranking',
    path: 'ranking',
    icon: <IoBarChartSharp />,
  },
  {
    text: 'stats',
    path: 'stats',
    icon: <MdQueryStats />,
  },
  {
    text: 'profile',
    path: 'profile',
    icon: <ImProfile />,
  },
  {
    text: 'admin',
    path: 'admin',
    icon: <MdAdminPanelSettings />,
  },
];

export default links;

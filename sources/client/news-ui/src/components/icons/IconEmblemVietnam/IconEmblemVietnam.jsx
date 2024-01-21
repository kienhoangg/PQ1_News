import React from 'react';
import PropTypes from 'prop-types';
import image from '../../../assets/images/home/Emblem_of_Vietnam.svg.png';

IconEmblemVietnam.propTypes = {};

function IconEmblemVietnam(props) {
    return <div style={{ backgroundImage: `url(${image})` }}></div>;
}

export default IconEmblemVietnam;

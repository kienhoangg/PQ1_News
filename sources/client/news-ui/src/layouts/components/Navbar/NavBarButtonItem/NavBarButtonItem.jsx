import imageHelper from 'helpers/imageHelper';
import stringHelper from 'helpers/stringHelper';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './NavBarButtonItem.scss';

NavBarButtonItem.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    href: PropTypes.string,
    imageName: PropTypes.string,
};

NavBarButtonItem.defaultProps = {
    label: '',
    href: '',
    imageName: undefined,
};

function NavBarButtonItem(props) {
    const { imageName, label, href } = props;
    return (
        <Link className='navbar-button-item' to={href} color='inherit'>
            {stringHelper.isNullOrEmpty(imageName) && <img src={imageHelper.getLinkImageUrl(imageName)} alt='logo' height={16} style={{ marginRight: 4 }} />}
            <span>{label}</span>
        </Link>
    );
}

export default NavBarButtonItem;

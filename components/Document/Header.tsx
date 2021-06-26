import React, { useState } from 'react';
import './style.scss'
import { Button } from 'antd';
import { Input, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Dropdown } from './Dropdown'
import { Avatar } from 'antd';

export const Header = () => {
    const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
    console.log(isShowMenu)
    return (
        <div className="document-background">
           AAAA
        </div>


    )
}
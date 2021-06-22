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
            <div className="container">
                <div className="document-header">
                    <div className="document-header-element">
                        <input type="checkbox" className="nav-input" hidden id="menu-dropdown" checked={isShowMenu}/>
                        <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_PTIT.jpg/768px-Logo_PTIT.jpg" />
                        <span className="school-name" onClick={() => setIsShowMenu(!isShowMenu)}>Học viện Bưu chính viễn thông</span>
                        <div className="menu-school">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="document-header-element">
                        <Input
                            placeholder="Tên môn học...."
                            suffix={
                                <Tooltip title="Tìm kiếm môn học">
                                    <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </div>

                    <div className="document-header-buttons document-header-element">
                        <Button type="primary" style={{ backgroundColor: 'red' }} className="document-header-button">Đóng góp tài liệu</Button>
                    </div>
                </div>
            </div>
        </div>


    )
}
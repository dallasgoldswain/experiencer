﻿import * as React from "react";
import ResumeComponent, { ResumeComponentProps, SelectedComponentProps, Action } from "./ResumeComponent";
import EditButton, { AddButton, DownButton, UpButton, DeleteButton } from "./Buttons";
import { ButtonGroup, Button, Dropdown, DropdownButton } from "react-bootstrap";
import AddIcon from "../icons/add-24px.svg";

export interface EntryProps extends ResumeComponentProps {
    title?: string;
    titleExtras?: string[];
    subtitle?: string;
    subtitleExtras?: string[];
}

interface EntryState {
    isHovering: boolean;
    isSelected: boolean;
}

export default class Entry extends ResumeComponent<EntryProps, EntryState> {
    constructor(props) {
        super(props);

        this.state = {
            isHovering: false,
            isSelected: false
        };

        this.addTitleField = this.addTitleField.bind(this);
        this.addSubtitleField = this.addSubtitleField.bind(this);
        this.setSelected = this.setSelected.bind(this);
    }

    addTitleField() {
        let replTitle = this.props.titleExtras || [];
        replTitle.push("");
        this.updateData('titleExtras', replTitle);
    }

    addSubtitleField() {
        let replTitle = this.props.subtitleExtras || [];
        replTitle.push("");
        this.updateData('subtitleExtras', replTitle);
    }

    getEditingControls() {
        if (this.state.isSelected && !this.props.isPrinting) {
            return <ButtonGroup size="sm">
                <DropdownButton as={ButtonGroup} title="Add" id="add-options" size="sm">
                    <Dropdown.Item onClick={this.addList}>Bulleted List</Dropdown.Item>
                    <Dropdown.Item onClick={this.addParagraph}>Paragraph</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.addTitleField}>Add another title field</Dropdown.Item>
                    <Dropdown.Item onClick={this.addSubtitleField}>Add another subtitle field</Dropdown.Item>
                </DropdownButton>
                <EditButton {...this.props} extended={true} />
                <DeleteButton {...this.props} extended={true} />
                <UpButton {...this.props} extended={true} />
                <DownButton {...this.props} extended={true} />
            </ButtonGroup>
        }

        return <></>
    }

    getExtras(key: string, updater: (idx: number, event: any) => void) {
        const extraData = this.props[key];
        if (extraData) {
            if (this.props.isEditing) {
                return extraData.map((text, index) =>
                    <input key={index} onChange={updater.bind(this, index)} value={text || ""} />
                );
            }

            return extraData.map((text, index) => <span key={index}>{text || "Enter a value"}</span>);
        }

        return <></>
    }

    getTitleExtras() {
        return this.getExtras('titleExtras', this.updateTitleExtras);
    }

    getSubtitleExtras() {
        return this.getExtras('subtitleExtras', this.updateTitleExtras);
    }

    setSelected() {
        if (!this.state.isSelected) {
            this.setState({ isSelected: true });
            if (this.props.unselect as Action) {
                (this.props.unselect as Action)();
            }
            (this.props.updateSelected as (data: SelectedComponentProps) => void)({
                unselect: this.unselect.bind(this)
            });
        }
    }

    unselect() {
        this.setState({
            isSelected: false
        });
    }

    updateExtras(key: string, idx: number, event: any) {
        let replTitle = this.props[key] || [];

        // Replace contents
        replTitle[idx] = event.target.value;
        this.updateData(key, replTitle);
    }

    updateTitleExtras(idx: number, event: any) {
        this.updateExtras('titleExtras', idx, event);
    }

    updateSubtitleExtras(idx: number, event: any) {
        this.updateExtras('subtitleExtras', idx, event);
    }
    
    render() {
        let className = 'resume-entry';
        const titleExtraData = this.props.titleExtras as string[];
        const subtitleExtraData = this.props.subtitleExtras as string[];

        let title: any = this.props.title || "Enter a title";
        let subtitle: any = this.props.subtitle || "Enter a subtitle";

        if (this.props.isEditing) {
            title = <input onChange={this.updateDataEvent.bind(this, "title")} value={this.props.title || ""} />;
            subtitle = <input onChange={this.updateDataEvent.bind(this, "subtitle")} value={this.props.subtitle || ""} />
        }

        if (!this.props.isPrinting && (this.state.isHovering || this.state.isSelected)) {
            className += ' resume-selected';
        }

        return <div className={className}>
            {this.getEditingControls()}
            <h3 className="flex-row" onClick={this.setSelected}
                onMouseEnter={() => this.setState({ isHovering: true })}
                onMouseLeave={() => this.setState({ isHovering: false })}
            >
                {title} {this.getTitleExtras()}
            </h3>
            <p className="flex-row subtitle">{subtitle} {this.getSubtitleExtras()}</p>

            {this.renderChildren()}
        </div>
    }
}
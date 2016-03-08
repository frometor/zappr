import React, { Component, PropTypes } from 'react'
import { Button, Panel, ListGroup, ListGroupItem, Input } from 'react-bootstrap'
import fuzzysearch from 'fuzzysearch'
import RepositoryListItem from './RepositoryListItem.jsx'
import Spinner from './Spinner.jsx'

export default class RepositoryList extends Component {
  static propTypes = {
    selected: PropTypes.string.isRequired,
    repositories: PropTypes.array.isRequired,
    isUpdating: PropTypes.bool,
    filterBy: PropTypes.string.isRequired,
    filterRepos: PropTypes.func.isRequired,
    fetchAll: PropTypes.func.isRequired
  };

  static defaultProps = {
    repositories: [],
    filterBy: '',
    isUpdating: true
  };

  onFetchAll() {
    this.props.fetchAll(true)
  }

  updateSearch(evt) {
    this.props.filterRepos(evt.target.value)
  }

  render() {
    const {selected, repositories, isUpdating, filterBy} = this.props
    const filteredRepos = repositories.filter(r => fuzzysearch(filterBy, r.full_name))
    const repoList = filteredRepos.length > 0 ?
                      filteredRepos.map((repository, i) => ((
                          <RepositoryListItem key={i} repository={repository}
                                              active={repository.full_name === selected}/>
                        ))) :
                      <ListGroupItem>Oops, no repo found!</ListGroupItem>
    return (
      <Panel collapsible defaultExpanded header={`Repositories (${repositories.length})`}>
        <Input type='search'
              value={filterBy}
              onChange={this.updateSearch.bind(this)}
              placeholder='zalando/zappr'
              label={'Search for a repository'}/>
        <ListGroup componentClass="ul" fill>
          {isUpdating
              ? (<Spinner size={2}/>)
              : repoList}
        </ListGroup>
        <Button
            style={{width: '100%'}}
            disabled={isUpdating}
            onClick={this.onFetchAll.bind(this)}
            bsStyle='primary' lg>
            <i className='fa fa-refresh' />&nbsp;Load all from Github
        </Button>
      </Panel>
    )
  }
}

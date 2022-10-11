export default class FloodMemory implements FMData{

  constructor(
    public id: Number,
    public path: String,
    public title: String,
    public description: String,
    public isPublished: boolean,
    public tags: Array<String>,
    public render: String,
    public creatorId: String,
    public creatorName: String) {
      id
      path
      title
      description
      isPublished
      tags
      render
      creatorId
      creatorName
    }

    public getId() {
      return this.id
    }
    public setId(id: Number) {
      this.id = id
    }

    public getPath() {
      return this.path
    }
    public setPath(path: String) {
      this.path = path
    }

    public getTitle() {
      return this.title
    }
    public setTitle(title: String) {
      this.title = title
    }

    public getDescription() {
      return this.description
    }
    public setDescription(description: String) {
      this.description = description
    }

    public getIsPublished() {
      return this.isPublished
    }
    public setIsPublished(isPublished: boolean) {
      this.isPublished = isPublished
    }

    public getTags() {
      return this.tags
    }
    public setTags(tags: Array<String>) {
      this.tags = tags
    }

    public getRender() {
      return this.render
    }
    public setRender(render: String) {
      this.render = render
    }

    public getCreatorId() {
      return this.creatorId
    }
    public setCreatorId(creatorId: String) {
      this.creatorId = creatorId
    }

    public getCreatorName() {
      return this.creatorName
    }
    public setCreatorName(creatorName: String) {
      this.creatorName = creatorName
    }
}

export interface FMData {
  id: Number
  path: String
  title: String
  description: String
  isPublished: boolean
  tags: Array<String>
  render: String
  creatorId: String
  creatorName: String
}
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BlogPostInterface } from '../../../common/types/blog-post.types';
import { UserProfile } from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
  },
})
export class BlogPost extends Document implements BlogPostInterface {
  @Prop({ type: raw(rawUserProfile), required: true, immutable: true })
  author: UserProfile;

  @Prop({ required: true, type: SchemaTypes.String })
  title: string;

  @Prop({ required: true, type: SchemaTypes.String })
  text: string;

  @Prop({ required: false, default: [], type: [String] })
  files: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);

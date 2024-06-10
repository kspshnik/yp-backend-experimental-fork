import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ContactsInterface } from '../../../common/types/contacts.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: false,
    flattenObjectIds: true,
  },
})
export class Contacts extends Document implements ContactsInterface {
  @Prop({
    required: true,
    type: SchemaTypes.String,
    validate: {
      validator(v) {
        return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  })
  email: string;

  @Prop({ required: true, type: SchemaTypes.String })
  socialNetwork: string;
}

export const ContactSchema = SchemaFactory.createForClass<ContactsInterface>(Contacts);

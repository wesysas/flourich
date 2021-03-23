import React, { Component} from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import BackButton from '../../components/BackButton';
import Moment from 'moment';
import { FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { getReviews } from '../../shared/service/api';
import { SERVER_URL } from '../../globalconfig';
import { SafeAreaView } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop:50
    },
    mozaicImg: {
        borderRadius: 10,
        width: 100,
        height: 100,
        aspectRatio: 1,
        alignSelf: 'center',
        resizeMode: 'center',
        margin: 5
    },
    mozaicImgLarge: {
        borderRadius: 10,
        width: 220,
        height: 210,
        alignSelf: 'center',
    },
    bottomSheetItem: {
        // backgroundColor:'transparent',
    },
    reviewContainer: {
        paddingBottom: 10
    },
    reviewDescription:{
        paddingHorizontal: 20
    }
});

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reviews: []
        };
    }

    async componentDidMount() {
        var reviews = await getReviews({ userid: global.user.cid, limit:100 });
        this.setState({reviews});
    }
  
    render () {
        return (
            <SafeAreaView>
                <BackButton navigation={this.props.navigation} />
            <ScrollView contentContainerStyle={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                />
               
                <FlatList
                    data={this.state.reviews}
                    renderItem={({ item }) => 
                    <View style={styles.reviewContainer}>
                        <ListItem>
                            <Avatar
                                rounded
                                size="medium"
                                source={{uri: SERVER_URL+ item.avatar}}
                            />
                            <ListItem.Content>
                                <ListItem.Title>{item.first_name} {item.last_name}</ListItem.Title>
                                <ListItem.Subtitle>
                                    {Moment(item.updated_at).fromNow()}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                        <Text style={styles.reviewDescription}>{item.review}</Text>
                    </View>
                        }
                />                      
            </ScrollView>
            </SafeAreaView>
        )
    }
}

import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../src/styles/styles';

import SearchInputWithIcon from '../src/components/SearchInputWithIcon';
import GoalsList from '../src/components/GoalsList';

export default class GoalsListScreen extends Component {
    constructor(props) {
        super(props)
        this.handleGoalPress = this.handleGoalPress.bind(this)
        this.state = {
            title: '',
            description: '',
            metric: '',
            days: 0,
        }
    }

    handleGoalPress = (goal) => {
        alert('id de meta: ' + goal.goal_id + '\n' + 'Titulo: ' + goal.title)
    }

    render() {

        // borrar al agregar la conexion con el backend
        // -------------------------------------------
        const goals = [
            {
                goal_id:1,
                title:"1Flexiones matutinas - simple",
                description:"asdfHacer 10 flexiones por día en ayunas",
                
                image_ids:[],
                objective:"Aprender la técnica correcta para hacer flexiones",
                deadline_days:10,
            },
            {
                goal_id:2,
                title:"2Flexiones matutinas - simple",
                description:"vHacer 10 flexiones por día en ayunas",
                
                image_ids:[1, 2, 3],
                objective:"vAprender la técnica correcta para hacer flexiones",
                deadline_days:10,
            },
            {
                goal_id:3,
                title:"3Flexiones matutinas - simple",
                description:"Hacer 10 flexiones por día en ayunas",
                
                image_ids:[1, 2, 3],
                objective:"Aprender la técnica correcta para hacer flexiones",
                deadline_days:10,
            },
            {
                goal_id:4,
                title:"4Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                
                image_ids:[1, 2, 3],
                objective:"xAprender la técnica correcta para hacer flexiones",
                deadline_days:10,
            },
            {
                goal_id:5,
                title:"5Flexiones matutinas - simple",
                description:"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                
                image_ids:[],
                objective:"yAprender la técnica correcta para hacer flexiones",
                deadline_days:10,
            },
            {
                goal_id:25,
                title:"25Flexiones matutinas - simple",
                description:"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                
                image_ids:[],
                objective:"yAprender la técnica correcta para hacer flexiones",
                deadline_days:10,
            },
            {
                goal_id:7,
                title:"7Flexiones matutinas - simple",
                description:"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                
                image_ids:[],
                objective:"yAprender la técnica correcta para hacer flexiones",
                deadline_days:10,
            },
        ]
        // -------------------------------------------
        
        return (
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}
                style={styles.scrollView}
            >
            
            <View style={styles.container}>
                
                <SearchInputWithIcon
                    onIconPress={() => alert('Icon pressed')}
                    onSubmit={(queryText) => alert('searching for ' + queryText)}
                    style={{
                        marginTop: 20,
                    }}
                />

                <GoalsList 
                    goals={goals} 
                    style={{
                        marginTop: 20,
                    }}
                    onGoalPress={this.handleGoalPress}
                />

            </View>
              
            </ScrollView>
        );
    }
}
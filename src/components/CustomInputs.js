import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Input } from 'react-native-elements';
import { Controller } from 'react-hook-form';

const styles = StyleSheet.create({
    maskInput: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000000',//'#2f2f2f',
        fontSize: 16,
        marginHorizontal: 10,
        marginBottom: 20
    },
    errorMsg:{
        color:'red',
        marginTop:-20,
        marginBottom:10,
        marginLeft:10
    }
})

export const CustomInput = ({ _filedName, _control, _errors, _defaultValue, _placeholder }) => {
    return (
        <View>
            <Controller
                control={_control}
                render={({ onChange, onBlur, value }) => (
                    <Input style={{paddingHorizontal:0}} inputContainerStyle ={{ marginHorizontal:-10 }}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder={_placeholder ? _placeholder : ''}
                    />
                )}
                name={_filedName}
                rules={{ required: true }}
                defaultValue={_defaultValue ? _defaultValue : ''}
                placeholder="erere"
            />
            {_errors[_filedName] && (<Text style={styles.errorMsg}>This field is required</Text>)}
        </View>
    )
}

export const CustomMaskInput = ({ _filedName, _control, _errors, _defaultValue, _placeholder }) => {
    return (
        <View>
            <Controller
                control={_control}
                render={({ onChange, onBlur, value }) => (
                    <TextInputMask
                        type={'datetime'}
                        style={[styles.maskInput]}
                        options={{
                            format: 'DD/MM/YY'
                        }}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder={_placeholder ? _placeholder : ''}
                    />
                )}
                name={_filedName}
                rules={{ required: true }}
                defaultValue={_defaultValue ? _defaultValue : ''}
                placeholder="erere"
            />
            {_errors[_filedName] && (<Text style={styles.errorMsg}>This field is required</Text>)}
        </View>
    )
}


export const CustomPhoneMaskInput = ({ _filedName, _control, _errors, _defaultValue, _placeholder }) => {
    return (
        <View>
            <Controller
                control={_control}
                render={({ onChange, onBlur, value }) => (
                    <TextInputMask
                        type={'cel-phone'}
                        style={[styles.maskInput]}
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                        }}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder={_placeholder ? _placeholder : ''}
                    />
                )}
                name={_filedName}
                rules={{ required: true }}
                defaultValue={_defaultValue ? _defaultValue : ''}
                placeholder="erere"
            />
            {_errors[_filedName] && (<Text style={styles.errorMsg}>This field is required</Text>)}
        </View>
    )
}


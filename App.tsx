/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress'
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { s } from "react-native-wind";
import { theme } from './theme';
type SectionProps = PropsWithChildren<{
  title: string;
}>;
import { debounce } from 'lodash'
import { fetchLocations, fetchWeatherForecast } from './api/weather';
import { weatherImages } from './constants';
import { getData, storeData } from './utils/asyncStorage';
function App(): JSX.Element {
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [locations, setLocations] = useState<any>([])
  const [weather, setWeather] = useState<any>({})
  const [loader, setLoader] = useState<any>(true)
  const currencyConverterEndpoint = 'https://api.frankfurter.app/latest'



  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'transparent',
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  function handleLocation(loc: any) {
    setLoader(true)
    setLocations([])
    setShowSearch(false);
    fetchWeatherForecast({
      cityName: loc?.name,
      days: '7'
    }).then(data => {
      setWeather(data)
      setLoader(false)
      storeData('city', loc?.name)

    })
  }
  const handleSearch = (value: any) => {
    // fetch locations

    if (value.length > 2) {
      fetchLocations({ cityName: value }).then(data => {
        setLocations(data)

      })
    }

    return 0
  }
     const place = getData('city')
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])
  const { current, location } = weather;
  useEffect(() => {
   let cty:any = 'Buea'
    if(typeof place == 'string'){
      cty = place
      
    }
    const loc = { name: cty }
    handleLocation(loc)
  }, [])
  return (
    <View className='flex-1 relative'>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Image blurRadius={30} source={require('./assets/images/bg1.jpg')}
        //  style={s`absolute w-full h-full`}
        style={styles.textInput}
      />
      {
        loader ? (
          <View className='flex-1 flex-row justify-center items-center'>
            <Progress.CircleSnail thickness={10} size={140} color={'#0bb3b2'} />

          </View>
        ): (
          <SafeAreaView style={styles.safeareastyle}>
        {/* search section */}
        <View className='mx-4 relative z-50 my-4' >
          <View className='flex-row flex justify-end items-center rounded-full' style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
            {
              showSearch ? (
                <TextInput className='pl-6 h-10 flex-1 text-base text-white' placeholder='Search City'
                  onChangeText={handleTextDebounce}
                  placeholderTextColor={'lightgray'} />
              ) : null
            }

            <TouchableOpacity onPress={() =>
              setShowSearch(!showSearch)} className=' m-1 p-3 rounded-full' style={{ backgroundColor: theme.bgWhite(0.3) }}>
              <MagnifyingGlassIcon size="25" color="white" />
            </TouchableOpacity>
          </View>
          {
            locations.length > 0 && showSearch ? (
              <View className=' absolute bg-gray-300 w-full top-16 rounded-3xl'>
                {
                  locations.map((loc: any, index:any) => {
                    let showBorder = index + 1 != locations.length
                    let borderClass = showBorder ? 'flex flex-row items-center border-0 p-3 px-4 mb-1 border-b-2 border-b-gray-400' : 'flex flex-row items-center border-0 p-3 px-4 mb-1 ';
                    return (
                      <TouchableOpacity
                        onPress={() => handleLocation(loc)}
                        key={index}
                        className={borderClass}>
                        <MapPinIcon size={'20'} color={'gray'} />
                        <Text className='text-black text-lg ml-2'>
                          {loc?.name}, {loc?.country}
                        </Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            ) : null
          }
        </View>
        {/* forecast section */}

        <View className='mx-4 flex justify-around mb-2 h-[62vh] '>
          {/* location details */}
          <Text className='text-white text-center text-2xl font-bold'>
            {location?.name},
            <Text className='text-lg font-semibold text-gray-300'>
              {" " + location?.country}
            </Text>
          </Text>
          <View className=' flex-row justify-center'>
            {current && <Image
              source={weatherImages[current?.condition?.text]}
              className='w-52 h-52' />}
          </View>
          <View className='space-y-2'>
            <Text className='text-center font-bold text-white text-6xl ml-5'>{current?.temp_c}&#176;</Text>
            <Text className='text-center text-white text-xl tracking-widest'>{current?.condition?.text}</Text>
          </View>
          <View className='flex-row space-x-2 items-center justify-between'>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('./assets/icons/wind.png')} className='h-6 w-6' />
              <Text className='text-white font-semibold text-base'>{current?.wind_kph}km</Text>
            </View>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('./assets/icons/drop.png')} className='h-6 w-6' />
              <Text className='text-white font-semibold text-base'>{current?.humidity}%</Text>
            </View>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('./assets/images/sun.png')} className='h-6 w-6' />
              <Text className='text-white font-semibold text-base'>{ weather?.forecast?.forecastday[0]?.astro?.sunrise }</Text>
            </View>
          </View>


        </View>
        <View className='mb-2 space-y-3'>
          <View className='flex-row items-center mx-5 space-x-2'>
            <CalendarDaysIcon size={"22"} color={"white"} />
            <Text className=' text-white text-base'>Daily forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            {
              weather?.forecast?.forecastday?.map((item: any, index: any) => {
                let date = new Date(item?.date)
                let options:Intl.DateTimeFormatOptions  = {weekday: "long"};
                let dayName = date?.toLocaleDateString('en-US', options).split(',')[0]
                
                return (
                  <View key={index} className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      className='h-11 w-11' />
                    <Text className='text-white'>{dayName}</Text>
                    <Text className='text-white text-xl font-semibold'>{item?.day?.avgtemp_c}&#176;</Text>
                  </View>
                )
              })
            }

          </ScrollView>
        </View>

      </SafeAreaView>
        )
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  textInput: {
    width: "100%",
    height: 1000,
    position: 'absolute'
  }, safeareastyle: {
    display: "flex",
    order: '1',
  }, viewone: {
    height: '7%',
    marginHorizontal: 16,
    marginVertical: 16,
    position: 'relative',
    zIndex: 500,
  }, viewtwo: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: 'white'
  }, viewthree: {
    height: '7%',
    marginHorizontal: 16,
    position: 'relative',
    zIndex: 50,
  },
});

export default App;

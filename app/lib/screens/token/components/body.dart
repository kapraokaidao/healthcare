import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class Body extends StatelessWidget {
  Future<dynamic> fetchUser() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final access_token = prefs.getString('access_token');
    final response = await http.get(
        "https://dev-healthcare-backend.kaoths.dev/user/me",
        headers: {'Authorization': 'Bearer $access_token'});
    final responseJson = jsonDecode(response.body);
    return responseJson;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  _logout(context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove('access_token');
    Navigator.pushReplacement(
        context, MaterialPageRoute(builder: (context) => StartScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchUser(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final user = snapshot.data;
                return Column(
                  children: [
                    Container(
                        margin: EdgeInsets.all(20),
                        padding: EdgeInsets.all(20),
                        child: Text('Test'),
                        width: double.infinity,
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: Colors.white,
                            border: Border.all(
                              color: Colors.grey,
                              style: BorderStyle.solid,
                              width: 1,
                            ))),
                  ],
                );
              } else {
                return Center(child: CircularProgressIndicator());
              }
            }));
  }
}

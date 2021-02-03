import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:pin_entry_text_field/pin_entry_text_field.dart';

class Body extends StatefulWidget {
  final dynamic serviceId;

  const Body({Key key, this.serviceId}) : super(key: key);

  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  Future<dynamic> fetchToken() async {
    final response =
        await HttpClient.get(path: '/healthcare-token/${widget.serviceId}');
    return response;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  String _pin = '';
  bool _isLoading = false;

  _sendPin(pin) {
    setState(() {
      this._pin = pin.toString();
    });
  }

  _receiveToken(context) async {
    final numericRegex = RegExp(r'^\d{1,6}$');
    if (numericRegex.hasMatch(this._pin)) {
      setState(() {
        this._isLoading = true;
      });
      final response = await HttpClient.post('/healthcare-token/receive', {
        "serviceId": widget.serviceId.toString(),
        "pin": this._pin.toString()
      });
      setState(() {
        this._isLoading = false;
      });
      if (response.containsKey("statusCode") && response["statusCode"] != 200) {
        return showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: Text('Error'),
                content: Text(response["message"]),
              );
            });
      }
      Navigator.push(context, TokenScreen.route());
    } else {
      return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              content: Text('กรุณาใส่ PIN ให้ถูกต้อง'),
            );
          });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return SingleChildScrollView(
            child: FutureBuilder<dynamic>(
                future: fetchToken(),
                builder: (BuildContext context, AsyncSnapshot snapshot) {
                  if (snapshot.hasData) {
                    final token = snapshot.data;
                    return Column(
                      children: [
                        Container(
                            margin: EdgeInsets.all(20),
                            padding: EdgeInsets.all(20),
                            child: Table(
                              children: [
                                TableRow(children: [
                                  Text('ชื่อ',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(token["name"])
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('รายละเอียด',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(token["description"])
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('จำนวน',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text('${token["tokenPerPerson"]}')
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('วันหมดสิทธิ์',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text('${token["endDate"]}')
                                ])
                              ],
                            ),
                            width: double.infinity,
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: Colors.white,
                                border: Border.all(
                                  color: Colors.grey,
                                  style: BorderStyle.solid,
                                  width: 1,
                                ))),
                        (() {
                          if (this._isLoading) {
                            return Center(child: CircularProgressIndicator());
                          } else {
                            return Container(
                              child: Column(
                                children: [
                                  Container(
                                      child: Padding(
                                        padding: EdgeInsets.all(20),
                                        child: PinEntryTextField(
                                          fields: 6,
                                          isTextObscure: true,
                                          showFieldAsBox: true,
                                          onSubmit: _sendPin,
                                        ),
                                      ),
                                      margin: EdgeInsets.all(20),
                                      decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(10),
                                          color: Colors.white,
                                          border: Border.all(
                                            color: Colors.grey,
                                            style: BorderStyle.solid,
                                            width: 1,
                                          ))),
                                  Container(
                                      margin: EdgeInsets.only(
                                          left: 20, right: 20, top: 20),
                                      child: ButtonTheme(
                                          minWidth: double.infinity,
                                          child: RaisedButton(
                                            shape: RoundedRectangleBorder(
                                                borderRadius:
                                                    BorderRadius.circular(18.0),
                                                side: BorderSide(
                                                    color: Color(0xff0c96e4))),
                                            padding: EdgeInsets.only(
                                                left: 20,
                                                right: 20,
                                                top: 15,
                                                bottom: 15),
                                            color: Color(0xff0c96e4),
                                            child: const Text('รับสิทธิ',
                                                style: TextStyle(
                                                    fontSize: 16,
                                                    color: Colors.white)),
                                            onPressed: () {
                                              _receiveToken(context);
                                            },
                                          )))
                                ],
                              ),
                            );
                          }
                        }())
                      ],
                    );
                  } else {
                    return Center(child: CircularProgressIndicator());
                  }
                }));
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
